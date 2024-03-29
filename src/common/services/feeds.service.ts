//@ts-nocheck
import logService from './log.service';
import apiService from './api.service';
import {isAbort, isNetworkError} from './ApiErrors';
import entitiesService from './entities.service';
import feedsStorage from './storage/feeds.storage';
import i18n from './i18n.service';
import connectivityService from './connectivity.service';
import {boostedContentService} from '../../modules/boost';
import BaseModel from '../BaseModel';
import {Platform} from 'react-native';
import {GOOGLE_PLAY_STORE} from '../../config/Config';
import difference from 'lodash/difference';
import {showNotification} from '../../AppMessages';
import {BoostedContentService} from '../../modules/boost/services/boosted-content.service';
import sessionService from './session.service';
// import {hasVariation} from '../../../ExperimentsProvider';

export const shouldInjectBoostAtIndex = (i: number) => i > 0 && i % 5 === 0;

export type FeedRecordType = {
  owner_guid: string;
  timestamp: string;
  urn: string;
  entity?: Object;
};

/**
 * Feed store
 */
export default class FeedsService {
  /**
   * @var {boolean}
   */
  injectBoost: boolean = false;

  /**
   * @var {boolean}
   */
  asActivities: boolean = true;

  /**
   * @var {Number}
   */
  limit: number = 12;

  /**
   * @var {Number}
   */
  offset: number = 0;

  /**
   * @var {string}
   */
  endpoint: string = '';

  /**
   * @var {string}
   */
  countEndpoint: string = '';

  /**
   * @var {Record<string, any>}
   */
  params: Record<string, any> = {sync: 1};

  /**
   * @var {Array}
   */
  feed: Array<FeedRecordType> = [];

  /**
   * @var {string}
   */
  pagingToken: string = '';

  /**
   * @var {boolean}
   */
  endReached = false;

  /**
   * @var {boolean}
   */
  paginated = true;

  /**
   * @var {number|null}
   */
  fallbackAt = null;

  /**
   * @var {number}
   */
  fallbackIndex = -1;

  /**
   * the last time we checked for new posts
   */
  feedLastFetchedAt?: number;

  private boostedContent?: BoostedContentService;

  /**
   * @var {string}
   */
  dataProperty: string = 'entities';

  setDataProperty(name: string) {
    this.dataProperty = name;
    return this;
  }

  /**
   * Get entities from the current page
   */
  async getEntities(): Promise<Array<any>> {
    const end = this.limit + this.offset;
    console.log(
      'getting entities where end is ',
      end,
      'limit is ',
      this.limit,
      ' offset is ',
      this.offset,
      'this.paginated is ',
      this.paginated,
      ' and this.endReached is ',
      this.endReached,
      this.feed.length,
    );

    if (this.paginated && end >= this.feed.length && !this.endReached) {
      try {
        await this.fetch(true);
      } catch (err) {
        if (!isNetworkError(err)) {
          logService.exception('[FeedService] getEntities', err);
        }
      }
    }

    const feedPage = this.feed.slice(this.offset, end);
    return feedPage;
  }

  /**
   * Prepend entity
   * @param {BaseModel} entity
   */
  prepend(entity: BaseModel) {
    this.feed.unshift({
      owner_guid: entity.owner_guid,
      timestamp: Date.now().toString(),
      urn: entity.urn,
    });

    this.offset++;
    this.fallbackIndex++;

    const plainEntity = entity.toPlainObject();

    entitiesService.save(plainEntity);
    // save without wait
    feedsStorage.save(this);
  }

  /**
   * getter has More
   */
  get hasMore(): boolean {
    return this.feed.length > this.limit + this.offset;
  }

  /**
   * Set fallback index
   * @param {number} value
   */
  setFallbackIndex(value: number) {
    this.fallbackIndex = value;
  }

  /**
   * Set feed
   * @param {Array<FeedRecordType>} feed
   * @returns {FeedsService}
   */
  setFeed(feed: Array<FeedRecordType>): FeedsService {
    this.feed = feed;
    return this;
  }

  /**
   * Set inject boost
   * @param {boolean} injectBoost
   * @returns {FeedsService}
   */
  setInjectBoost(injectBoost: boolean): FeedsService {
    this.injectBoost = injectBoost;
    return this;
  }

  /**
   * Set inject boost
   * @param {boolean} injectBoost
   * @returns {FeedsService}
   */
  setBoostedContent(boostedContent: BoostedContentService): FeedsService {
    this.boostedContent = boostedContent;
    return this;
  }

  /**
   * Set limit
   * @param {number} limit
   * @returns {FeedsService}
   */
  setLimit(limit: number): FeedsService {
    this.limit = limit;
    return this;
  }

  /**
   * Set offset
   * @param {integer} offset
   * @returns {FeedsService}
   */
  setOffset(offset: number): FeedsService {
    this.offset = offset;
    return this;
  }

  /**
   * Set endpoint
   * @param {string} endpoint
   * @returns {FeedsService}
   */
  setEndpoint(endpoint: string): FeedsService {
    this.endpoint = endpoint;
    return this;
  }

  /**
   * Set count endpoint
   * @param {string} endpoint
   * @returns {FeedsService}
   */
  setCountEndpoint(endpoint: string): FeedsService {
    this.countEndpoint = endpoint;
    return this;
  }

  /**
   * Set parameters
   * @param {Object} params
   */
  setParams(params: Object): FeedsService {
    this.params = params;
    // if (!params.sync) {
    //   this.params.sync = 1; // fixme tgorer what is this
    // }
    return this;
  }

  noSync(): FeedsService {
    this.params.sync = 0;
    return this;
  }

  /**
   * Set as activities
   * @param {boolean} asActivities
   * @returns {FeedsService}
   */
  setAsActivities(asActivities: boolean): FeedsService {
    this.asActivities = asActivities;
    return this;
  }

  /**
   * Set paginated
   * @param {boolean} paginated
   * @returns {FeedsService}
   */
  setPaginated(paginated: boolean): FeedsService {
    this.paginated = paginated;
    return this;
  }

  /**
   * Abort pending fetch
   */
  abort() {
    apiService.abort(this);
  }

  /**
   * Calculate the index of the fallback
   */
  calculateFallbackIndex = () => {
    let index = -1;

    if (this.fallbackAt) {
      index = this.feed.findIndex(
        r =>
          r.entity &&
          r.entity.time_created &&
          parseInt(r.entity.time_created, 10) < this.fallbackAt,
      );
    }

    if (index !== -1) {
      this.fallbackIndex = index;
    } else {
      this.fallbackIndex = -1;
    }
  };

  /**
   * Fetch
   * @param {boolean} more
   */
  async fetch(more: boolean = false): Promise<void> {
    const params = {
      ...this.params,
      ...{limit: 8, offset: this.offset},
    };

    // if (this.paginated && more) {
    //   params.from_timestamp = this.pagingToken;
    // }
    const fetchTime = Date.now();
    const response = await apiService.get(this.endpoint, params, this);

    // console.log('fetch res is ', response);
    this.feedLastFetchedAt = fetchTime;
    this.feed = response;

    if (response?.length) {
      if (response.length < params.limit) {
        this.endReached = true;
      }
      if (more) {
        this.feed = this.feed.concat(response);
      } else {
        this.feed = response;
      }
      if (response.fallback_at) {
        this.fallbackAt = response.fallback_at;
        this.calculateFallbackIndex();
      } else {
        this.fallbackAt = null;
        this.fallbackIndex = -1;
      }
      // this.pagingToken = response['load-next'];
    } else {
      this.endReached = true;

      // if there is no result and isn't a pagination request we clear the feed data
      if (!more) {
        this.feed = [];
      }
    }

    // save without wait
    feedsStorage.save(this);
  }

  /**
   * Fetch feed from local cache
   * @returns {boolean} true if there is local data or false otherwise
   */
  async fetchLocal(): Promise<boolean> {
    try {
      const feed = await feedsStorage.read(this);
      if (feed) {
        // support old format
        if (Array.isArray(feed)) {
          this.feed = feed;
          this.pagingToken = (
            this.feed[this.feed.length - 1].timestamp - 1
          ).toString();
        } else {
          this.feed = feed.feed;
          this.fallbackAt = feed.fallbackAt;
          this.fallbackIndex = feed.fallbackIndex;
          this.pagingToken = feed.next;
        }
        return true;
      }
    } catch (err) {
      logService.error('[FeedService] error loading local data');
    }

    return false;
  }

  /**
   * Fetch feed from local cache or from the remote endpoint if there is no cached data
   */
  async fetchLocalOrRemote(): Promise<void> {
    const status = await this.fetchLocal();

    try {
      if (!status) {
        await this.fetch();
      }
    } catch (err) {
      if (isAbort(err)) {
        return;
      }

      if (!isNetworkError(err)) {
        logService.exception('[FeedService]', err);
      }

      throw err;
    }
  }

  /**
   * Fetch from the remote endpoint and if it fails from local cache
   */
  async fetchRemoteOrLocal(): Promise<void> {
    try {
      console.log('frol0');
      await this.fetch();
      console.log('frol1');
    } catch (err) {
      if (isAbort(err)) {
        return;
      }

      if (!isNetworkError(err)) {
        logService.exception('[FeedService]', err);
      }

      if (!(await this.fetchLocal())) {
        // if there is no local data rethrow the exception
        throw err;
      }

      // TODO: remove this after fixed https://github.com/react-native-netinfo/react-native-netinfo/issues/669
      if (connectivityService.isConnected) {
        return;
      }

      showNotification(
        connectivityService.isConnected
          ? i18n.t('cantReachServer')
          : i18n.t('noInternet'),
        'info',
        3000,
        i18n.t('showingStored'),
      );
    }
  }

  /**
   * Remove all from owner
   * @param {string} guid
   */
  removeFromOwner(guid: string): Promise<void> {
    let count = this.feed.length;
    this.feed = this.feed.filter(e => !e.owner_guid || e.owner_guid !== guid);
    count -= this.feed.length;
    this.offset -= count;
    feedsStorage.save(this);
  }

  /**
   * Move offset to next page
   */
  next(): FeedsService {
    this.offset += 1;
    return this;
  }

  /**
   * Clear the store
   */
  clear(): FeedsService {
    this.offset = 0;
    this.fallbackAt = null;
    this.fallbackIndex = -1;
    this.pagingToken = '';
    this.feed = [];
    return this;
  }

  /**
   * counts newsfeed posts created after fromTimestamp
   * @param { number } fromTimestamp
   * @returns { Promise<number> }
   */
  async count(fromTimestamp?: number): Promise<number> {
    if (!this.countEndpoint) {
      throw new Error('[FeedsService] No count endpoint');
    }

    if (!fromTimestamp) {
      throw new Error('[FeedsService] No fromTimestamp provided');
    }

    const params = {
      from_timestamp: fromTimestamp,
    };

    const result = await apiService.get(this.countEndpoint, params, this);
    return result.count;
  }
}

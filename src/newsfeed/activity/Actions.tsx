import React, {useCallback} from 'react';

import {StyleSheet, View} from 'react-native';

import {observer} from 'mobx-react';

import ThumbAction from './actions/ThumbAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';
import BoostAction from './actions/BoostAction';
import BaseModel from '../../common/BaseModel';
import {useNavigation} from '@react-navigation/native';
import ThemedStyles, {useMemoStyle} from '../../styles/ThemedStyles';
import SupermindAction from './actions/SupermindAction';
import ShareAction from './actions/ShareAction';
import {
  BOOSTS_ENABLED,
  IS_IOS,
  SUPERMIND_ENABLED,
  WIRE_ENABLED,
} from '../../config/Config';
import {useActivityContext} from './contexts/Activity.context';
import {Button, HairlineRow, Icon, Row} from '../../common/ui';
import {useAnalytics} from '../../common/contexts/analytics.context';
import ActivityModel from '../ActivityModel';
import Counter from './actions/Counter';
import PermissionsService from '../../common/services/permissions.service';

type PropsType = {
  entity: ActivityModel;
  hideCount?: boolean;
  onPressComment?: () => void;
  hideTabs?: boolean;
};

export const Actions = observer((props: PropsType) => {
  const {explicitVoteButtons, onPressComment} = props;
  const {onDownvote} = useActivityContext();
  const analytics = useAnalytics();
  const navigation = useNavigation();
  const containerStyle = useMemoStyle(
    [
      styles.container,
      {
        borderTopWidth: explicitVoteButtons
          ? undefined
          : StyleSheet.hairlineWidth,
      },
    ],
    [explicitVoteButtons],
  );

  if (props.hideTabs) {
    return null;
  }

  const entity = props.entity;
  // const isOwner = entity.isOwner();
  const isOwner = true;
  const isScheduled = BaseModel.isScheduled(
    parseInt(entity.time_created, 10) * 1000,
  );

  const voteUp = useCallback(() => {
    entity.toggleVote('up').then(() => {
      analytics.trackClick('vote:up');
    });
  }, [analytics, entity]);

  const voteDown = useCallback(() => {
    entity.toggleVote('down').then(() => {
      analytics.trackClick('vote:down');
    });

    if (entity.votedDown) {
      onDownvote?.();
    }
  }, [analytics, entity, onDownvote]);

  if (!entity) {
    return null;
  }

  return (
    <>
      <View style={containerStyle}>
        <>
          <ThumbAction
            direction="up"
            entity={entity}
            voted={entity.votedUp}
            hideCount={props.hideCount}
          />
        </>
        <CommentsAction
          // hideCount={props.hideCount}
          entity={entity}
          navigation={navigation}
          onPressComment={onPressComment}
          testID={entity.text === 'e2eTest' ? 'ActivityCommentButton' : ''}
        />
        {/*<RemindAction entity={entity} hideCount={props.hideCount} />*/}

        {/*{IS_IOS && <ShareAction entity={entity} />}*/}

        {!isOwner && WIRE_ENABLED && (
          <WireAction owner={entity.ownerObj} navigation={navigation} />
        )}

        {/*{isOwner && !isScheduled && BOOSTS_ENABLED && (*/}
        {/*  <BoostAction entity={entity} navigation={navigation} />*/}
        {/*)}*/}

        {/*{!isOwner && !IS_IOS && SUPERMIND_ENABLED && (*/}
        {/*  <SupermindAction entity={entity} />*/}
        {/*)}*/}
      </View>

      {/*{explicitVoteButtons && (*/}
      {/*  <>*/}
      {/*    <HairlineRow />*/}
      {/*    <Row align="centerBetween" horizontal="L" vertical="M">*/}
      {/*      <VoteButtonWithText*/}
      {/*        direction="up"*/}
      {/*        voted={entity.votedUp}*/}
      {/*        onVote={voteUp}*/}
      {/*        count={props.hideCount ? undefined : entity['thumbs_up_count']}*/}
      {/*      />*/}
      {/*    </Row>*/}
      {/*  </>*/}
      {/*)}*/}
    </>
  );
});

export default Actions;

const styles = ThemedStyles.create({
  container: [
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      minHeight: 64,
    },
    'bcolorPrimaryBorder',
  ],
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});

const VoteButtonWithText = ({
  direction,
  voted,
  onVote,
  count,
}: {
  direction: 'up' | 'down';
  voted: boolean;
  onVote: () => void;
  count?: number;
}) => (
  <Button
    size="small"
    mode="outline"
    containerStyle={true ? undefined : ThemedStyles.style.opacity50}
    disabled={false}
    color={voted ? 'link' : undefined}
    icon={
      <Row align="centerBoth" right="XS">
        <Icon color={voted ? 'Link' : undefined} name={`thumb-${direction}`} />
        {!!count && (
          <Counter
            style={voted ? ThemedStyles.style.colorLink : undefined}
            count={Number(count)}
            spaced={true}
            animated={false}
          />
        )}
      </Row>
    }
    onPress={onVote}>
    {/*{direction === 'up' ? 'See more of this' : 'See less of this'}*/}
  </Button>
);

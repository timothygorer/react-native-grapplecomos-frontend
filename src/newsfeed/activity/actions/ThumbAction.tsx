import {observer} from 'mobx-react';
import React from 'react';
import {View} from 'react-native';
import PressableScale from '../../../common/components/PressableScale';
import {IconMapNameType} from '../../../common/ui/icons/map';
import {UISizing} from '../../../styles/Tokens';
import {Icon} from '../../../common/ui/icons';
import {FLAG_VOTE} from '../../../common/Permissions';
import remoteAction from '../../../common/RemoteAction';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import {useAnalytics} from '../../../common/contexts/analytics.context';
import type ActivityModel from '../../ActivityModel';
import EntityCounter from './EntityCounter';
import {actionsContainerStyle, actionsContainerWrapper} from './styles';
import {useActivityContext} from '../contexts/Activity.context';
import PermissionsService from '../../../common/services/permissions.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import {useAuth} from '../../../shared/utils/AuthContext';
import {useNavigation} from '@react-navigation/native';

export interface ThumbProps {
  direction: 'up' | 'down';
  entity: ActivityModel;
  voted?: boolean;
  size?: UISizing | string;
  hideCount?: boolean;
  touchableComponent?: React.ComponentClass;
}

const ThumbAction = ({direction = 'up', size = '21', ...props}: ThumbProps) => {
  // const canInteract = PermissionsService.canInteract();
  const canInteract = true;
  const {quietDownvote, onDownvote} = useActivityContext();
  const entity = props.entity;
  // const canVote = entity.can(FLAG_VOTE);
  const canVote = true;
  const Touchable = props.touchableComponent || PressableScaleCustom;
  const voted = !!props.voted;
  const hideCount = props.hideCount || direction === 'down';
  const {profile, authStatus} = useAuth();
  const navigation = useNavigation();

  const toggleThumb = async () => {
    // if (!entity.can(FLAG_VOTE, true)) {
    //   return;
    // }

    if (authStatus === 'SIGNED_IN') {
      if (direction === 'down' && !voted) {
        onDownvote?.();
      }

      entity.toggleVote(direction).then(() => {
        // analytics.trackClick(`vote:${direction}`);
      });
    } else {
      navigation.navigate('LoginWelcomeScreen');
    }
  };

  return (
    <Touchable
      style={
        canInteract
          ? actionsContainerStyle
          : [actionsContainerStyle, ThemedStyles.style.opacity50]
      }
      disabled={!canInteract}
      onPress={toggleThumb}
      testID={`Thumb ${direction} activity button`}>
      <View style={actionsContainerWrapper}>
        <AnimatedThumb
          canVote={canVote}
          voted={voted}
          size={size}
          name={`thumb-${direction}`}
          down={direction !== 'up'}
        />
        <EntityCounter
          entity={entity}
          countProperty={`thumbs_${direction}_count`}
        />
      </View>
    </Touchable>
  );
};

export default observer(ThumbAction);

// prevent double tap in touchable
const PressableScaleCustom = withPreventDoubleTap(PressableScale);

// const AnimatedIcon: any = motify(withClass(Icon))();

const AnimatedThumb = ({
  voted,
  size,
  canVote,
  down,
  name,
}: {
  voted: boolean;
  size: UISizing | string;
  canVote: boolean;
  down: boolean;
  name: IconMapNameType;
}) => {
  // const initialRender = React.useRef(true);
  // TODO: enable animation https://github.com/nandorojo/moti/issues/131
  // const animation = useAnimationState({
  //   from: {
  //     transform: [
  //       // {
  //       //   scale: 1,
  //       // },
  //       // {
  //       //   rotate: '0deg',
  //       // },
  //       {
  //         translateY: 0,
  //       },
  //       {
  //         translateX: 0],
  //       },
  //     ],
  //   },
  //   up: {
  //     transform: [
  //       // {
  //       //   scale: [
  //       //     { value: 1, type: 'timing', duration: 80 },
  //       //     { value: 1.05, type: 'timing', duration: 100 },
  //       //     { value: 1, type: 'spring', delay: 80, stiffness: 600 },
  //       //   ],
  //       // },
  //       // {
  //       //   rotate: [
  //       //     { value: '0deg', type: 'timing', duration: 80 },
  //       //     { value: '-12deg', type: 'timing', duration: 100 },
  //       //     { value: '0deg', type: 'spring', delay: 80, stiffness: 600 },
  //       //   ],
  //       // },
  //       {
  //         translateY: [
  //           { value: 0, type: 'timing', duration: 80 },
  //           { value: down ? 6 : -6, type: 'timing', duration: 100 },
  //           { value: 0, type: 'spring', delay: 80, stiffness: 600 },
  //         ],
  //       },
  //     ],
  //   },
  //   down: {
  //     translateX: [-10, 0],
  //   },
  // });

  // React.useEffect(() => {
  //   if (initialRender.current) {
  //     initialRender.current = false;
  //     return;
  //   }
  //   if (voted) {
  //     frameThrower(10, () => animation.transitionTo('up'));
  //   } else {
  //     frameThrower(20, () => animation.transitionTo('down'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [voted]);

  // const disabled = !canVote;
  // const active = !!(canVote && voted);

  // return (
  //   <AnimatedIcon
  //     active={active}
  //     disabled={disabled}
  //     name={name}
  //     size={size}
  //     // state={animation}
  //   />
  // );
  const disabled = !canVote;
  const active = !!(canVote && voted);

  return <Icon active={active} disabled={disabled} name={name} size={size} />;
};

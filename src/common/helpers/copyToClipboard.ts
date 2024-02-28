// import Clipboard from '@react-native-clipboard/clipboard';
import {showNotification} from '../../AppMessages';
import i18n from '../../common/services/i18n.service';

export const copyToClipboardOptions = (text: string, onClose?: () => void) => ({
  iconName: 'content-copy',
  iconType: 'material-community',
  title: i18n.t('copyLink'),
  onPress: () => {
    copyToClipboard(text);
    onClose?.();
  },
});

export const copyToClipboard = (text?: string) => {
  if (!text) return;
  // Clipboard.setString(text);
  showNotification(i18n.t('linkCopied'));
};

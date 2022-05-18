import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DnsIcon from '@material-ui/icons/Dns';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

const navItems = [
  {
    content: [
      {
        label: "Hosts",
        icon: DynamicFeedIcon,
        to: "/hosts"
      },
      {
        label: "My Host",
        icon: DnsIcon,
        to: "/host"
      },
      {
        label: "Registry",
        icon: SettingsApplicationsIcon,
        to: "/registry"
      }
    ]
  }];

export default navItems;

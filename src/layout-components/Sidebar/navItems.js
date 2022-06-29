import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import DnsIcon from '@mui/icons-material/Dns';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

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

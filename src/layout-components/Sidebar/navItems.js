import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import DnsIcon from '@mui/icons-material/Dns';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountBalance from '@mui/icons-material/AccountBalance';

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
      },
      {
        label: "Testnet Faucet",
        icon: AccountBalance,
        to: "/testnet-faucet"
      }
    ]
  }];

export default navItems;

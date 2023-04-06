import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DnsIcon from '@material-ui/icons/Dns';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AccountBalance from '@material-ui/icons/AccountBalance';

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
      },
      {
        label: "Candidates",
        icon: AccountBalance,
        to: "/candidates"
      },
    ]
  }];

export default navItems;

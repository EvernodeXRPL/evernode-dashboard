import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DnsIcon from '@material-ui/icons/Dns';

const navItems = [
  {
    content: [
      {
        label: "Hosts",
        icon: DynamicFeedIcon,
        to: "/hosts"
      },
      {
        label: "Profile",
        icon: DnsIcon,
        to: "/profile"
      }
    ]
  }];

export default navItems;

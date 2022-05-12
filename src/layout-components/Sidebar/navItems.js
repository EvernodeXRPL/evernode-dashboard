import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DnsIcon from '@material-ui/icons/Dns';

let hostAddress = localStorage.getItem('hostAddress');
if (!hostAddress) {
  let address;
  while (!/^r[a-zA-Z0-9]{24,34}$/g.test(address)) {
    address = prompt("Please enter host address");
    if (!address) break;
  }

  if (address) {
    localStorage.setItem('hostAddress', address);
    hostAddress = address;
  }
}

const navItems = [
  {
    content: [
      {
        label: "Hosts",
        icon: DynamicFeedIcon,
        to: "/hosts"
      }
    ]
  }];

if (hostAddress) {
  navItems[0].content.push({
    label: "Profile",
    icon: DnsIcon,
    to: "/profile/" + hostAddress
  })
}

export default navItems;

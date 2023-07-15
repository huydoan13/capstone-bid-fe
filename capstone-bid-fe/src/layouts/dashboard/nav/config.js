// component
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: <AccountCircleTwoToneIcon />,
    items: [
      { title: 'Active', path: '/dashboard/user' },
    ]
  },
  {
    title: 'User Đang chờ duyệt',
    path: '/dashboard/user-waiting',
    icon: <AccountCircleTwoToneIcon />,
  },
  {
    title: 'staff',
    path: '/dashboard/staff',
    icon: icon('ic_staff'),
  },
  {
    title: 'session',
    path: '/dashboard/sessions',
    icon: icon('ic_staff'),
  },
  {
    title: 'booking-item',
    path: '/dashboard/booking-items',
    icon: icon('ic_staff'),
  },
  {
    title: 'item',
    path: '/dashboard/items',
    icon: icon('ic_staff'),
  },
  {
    title: 'category',
    path: '/dashboard/category',
    icon: icon('ic_staff'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

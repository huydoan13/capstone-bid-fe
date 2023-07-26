// component
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Tổng quan',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Người dùng',
    path: '/dashboard/user',
    icon: <AccountCircleTwoToneIcon />,
    role: ['Admin', 'Staff'],
    items: [
      { title: 'Đang chờ duyệt', path: '/dashboard/user-waiting', icon: <AccountCircleTwoToneIcon />, },
      { title: 'Đang hoạt động', path: '/dashboard/user', icon: <AccountCircleTwoToneIcon />, },
      { title: 'Bị Cấm', path: '/dashboard/user-ban', icon: <AccountCircleTwoToneIcon />, },
    ]
  },
  {
    title: 'Nhân viên',
    path: '/dashboard/staff',
    icon: icon('ic_staff'),
    role: ['Admin'],
  },
  {
    title: 'Phiên đấu giá',
    path: '/dashboard/sessions',
    icon: icon('ic_staff'),
    role: ['Admin', 'Staff'],
    items: [
      { title: 'Thành Công', path: '/dashboard/session-success', icon: <AccountCircleTwoToneIcon />, },
      { title: 'Chưa Thanh Toán', path: '/dashboard/session-not-pay', icon: <AccountCircleTwoToneIcon />, },
      { title: 'Quá Hạn', path: '/dashboard/session-out-of-date', icon: <AccountCircleTwoToneIcon />, },
    ]
  },
  {
    title: 'Đơn đăng kí đấu giá',
    path: '/dashboard/booking-items',
    icon: icon('ic_staff'),
    role: ['Staff'],
  },
  {
    title: 'Tổng đơn đăng kí đấu giá',
    path: '/dashboard/all-booking-items',
    icon: icon('ic_staff'),
    role: ['Admin'],
  },
  {
    title: 'Luật đấu giá',
    path: '/dashboard/session-rule',
    icon: icon('ic_staff'),
    role: ['Admin'],
  },
  {
    title: 'Sản phẩm đấu giá',
    path: '/dashboard/items',
    icon: icon('ic_staff'),
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Các loại đấu giá',
    path: '/dashboard/category',
    icon: icon('ic_staff'),
    role: ['Admin'],
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'Đăng nhập',
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

// component
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Icon } from '@iconify/react';
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
    icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />,
    role: ['Admin', 'Staff'],
    items: [
      { title: 'Thành Công', path: '/dashboard/session-success', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Chưa Thanh Toán', path: '/dashboard/session-not-pay', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Thất bại', path: '/dashboard/session-out-of-date', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Đang diễn ra', path: '/dashboard/session-instage', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Chưa bắt đầu', path: '/dashboard/session-not-start', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Đã nhận hàng', path: '/dashboard/session-received', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
      { title: 'Sản phẩm lỗi', path: '/dashboard/session-error-item', icon: <Icon icon="mingcute:auction-fill" width="30" height="30" />, },
    ]
  },
  {
    title: 'Đơn đăng ký đấu giá',
    path: '/dashboard/booking-items',
    icon: <Icon icon="mdi:form" width="30" height="30" />,
    role: ['Staff'],
    items: [
      { title: 'Đơn đăng ký', path: '/dashboard/booking-items', icon: <Icon icon="mdi:form" width="30" height="30" />, },
      { title: 'Chưa có phiên', path: '/dashboard/booking-item-no-session', icon: <Icon icon="mdi:form" width="30" height="30" />, },
      { title: 'Đơn ưu tiên', path: '/dashboard/booking-item-now', icon: <Icon icon="mdi:form" width="30" height="30" />, },
    ]
  },
  // {
  //   title: 'Đơn đăng kí đấu giá',
  //   path: '/dashboard/booking-items',
  //   icon: icon('ic_staff'),
  //   role: ['Staff'],
  // },
  {
    title: 'Tổng đơn đăng ký đấu giá',
    path: '/dashboard/all-booking-items',
    icon: <Icon icon="mdi:form" width="30" height="30" />,
    role: ['Admin'],
  },
  {
    title: 'Cấu hình thời gian đấu giá',
    path: '/dashboard/session-rule',
    icon: <Icon icon="octicon:law-16" width="30" height="30" />,
    role: ['Admin'],
  },
  {
    title: 'Phân khúc đấu giá',
    path: '/dashboard/fee',
    icon: <Icon icon="nimbus:ordered-list" width="30" height="30" />,
    role: ['Admin'],
  },
  {
    title: 'Quản lý thanh toán',
    path: '/dashboard/payment-manage',
    icon: <Icon icon="tdesign:money" width="30" height="30" />,
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Sản phẩm đấu giá',
    path: '/dashboard/items',
    icon: <Icon icon="fluent-mdl2:product-variant" width="30" height="30" />,
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Các loại đấu giá',
    path: '/dashboard/category',
    icon: <Icon icon="bx:category" width="30" height="30" />,
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

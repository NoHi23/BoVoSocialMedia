import { Dimensions } from "react-native"; //  cho phép lấy kích thước màn hình thiết bị.

/**
 * Lấy ra chiều rộng (width) và chiều cao (height) của màn hình thiết bị hiện tại.

Gán chúng vào biến DeviceWidth và DeviceHeight.
 */
const { width: DeviceWidth, height: DeviceHeight } = Dimensions.get("window");

//  trả về số pixel tương ứng với % chiều cao.
export const hp = (percentage) => {
  return (percentage * DeviceHeight) / 100;
};

// trả về số pixel tương ứng với % chiều rộng.
export const wp = (percentage) => {
  return (percentage * DeviceWidth) / 100;
};

//
export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>?/gm, "");
};

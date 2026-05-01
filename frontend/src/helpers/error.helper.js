export const getErrorMessage = (error) => {
  if (error?.response) {
    const data = error.response.data;
    return (
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      "Dữ liệu không hợp lệ"
    );
  }
  if (error?.request) {
    return "Không thể kết nối server";
  }
  return error?.message || "Something went wrong";
};
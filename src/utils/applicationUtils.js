
export const isSuccessStatus = (statusCode) => {
    return statusCode >= 200 && statusCode < 300;
  };


  export const reloadPage = () => {
    window.location.reload();
  };
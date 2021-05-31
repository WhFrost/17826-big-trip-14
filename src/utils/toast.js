const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');
  toastItem.style.boxSizing = 'border-box';
  toastItem.style.position = 'fixed';
  toastItem.style.width = '50%';
  toastItem.style.top = '25%';
  toastItem.style.zIndex = '1000';
  toastItem.style.left = '0';
  toastItem.style.right = '0';
  toastItem.style.textAlign = 'center';
  toastItem.style.padding = '20px';
  toastItem.style.fontSize = '24px';
  toastItem.style.backgroundColor = 'white';
  toastItem.style.border = '5px';
  toastItem.style.borderStyle = 'solid';
  toastItem.style.borderColor = 'red';
  toastItem.style.textDecoration = 'underline';
  toastItem.style.textDecorationColor = 'red';

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export {
  toast
};

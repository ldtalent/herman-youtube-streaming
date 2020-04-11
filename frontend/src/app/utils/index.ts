const readURL = cb => (e) => {
  document
    .querySelector('#preview-pic')
    .addEventListener('change', function() {
      if (this.files && this.files[0]) {
        cb(this.files[0]);
      }
    });
};

export { readURL };

(function () {
  'use strict';

  const get = (target) => {
    return document.querySelector(target);
  };

  const $posts = get('.posts');
  const $loader = get('.loader');

  const limit = 10;
  let total = 10;
  let end = 100;
  let page = 1;

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error('에러 발생');
    }
    return response.json();
  };

  const showPost = (posts) => {
    posts.forEach((item) => {
      const $post = document.createElement('div');
      $post.classList.add('post');
      $post.innerHTML = `
        <div class="header">
          <div class="id">${item.id}</div>
          <div class="title">${item.title}</div>
        </div>
        <div class="body">
          ${item.body}
        </div>
      `;
      $posts.appendChild($post);
    });
  };

  const showLoader = () => {
    $loader.classList.add('show');
  };

  const hideLoader = () => {
    $loader.classList.remove('show');
  };

  const loadPost = async () => {
    showLoader();
    try {
      const response = await getPost();
      showPost(response);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (total === end) {
      window.removeEventListener('scroll', onScroll);
      return;
    }

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      page++;
      total += 10;
      loadPost();
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    loadPost();

    window.addEventListener('scroll', onScroll);
  });
})();

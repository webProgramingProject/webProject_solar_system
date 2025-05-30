 function toggleMenu() {
      const menu = document.getElementById('menu');
      menu.classList.toggle('active');
      const right = document.getElementById('right');
    // toggle width of right
    if (menu.classList.contains('active')) {
        right.classList.remove('collapsed');
        right.classList.add('expanded');
    } else {
        right.classList.remove('expanded');
        right.classList.add('collapsed');
    }
}
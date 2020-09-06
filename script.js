const getTemplate = (data = [], placeholder , selectedId) => {
  let text = placeholder || 'Текст';

  const items = data.map( item => {
      let cls = '';

      if (item.id === selectedId) {
          text = item.value;
          cls = 'selected';
      } 

      return `
      <li class="select__item" data-type="item" data-id="${item.id}">${item.value}</li>
      `
  })
  return `
  <div class="select__backdrop" data-type="backdrop"></div>
  
  <div class="select__input" data-type="input">
       <span data-type="value">${text}</span>
      <i class="fa fa-chevron-down" data-type="arrow"></i>           
  </div>
  <div class="select__dropdown">
      <ul class="select__list">
          ${items.join('')}
      </ul>
  </div> 
  `
}

class Select {
  constructor(selector, options) {
      this.$el = document.querySelector(selector);
      this.options = options;
      this.selectedId = options.selectedId;

      this.#render();
      this.#setup();
  }
  // создаем инпут
  #render() {
      const {placeholder, data} = this.options;
      this.$el.classList.add('select');
      this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
  }
  //задаем события
  #setup() {
      this.clickHandler = this.clickHandler.bind(this);
      this.$el.addEventListener('click', this.clickHandler);
      this.$arrow = this.$el.querySelector('[data-type="arrow"');
      this.$value = this.$el.querySelector('[data-type="value"]');
  }
  //функция клика
  clickHandler(event) {
      const {type} = event.target.dataset;
      //клик на инпут
      if (type === 'input') {
          this.toggle();
      //клик на список
      } else if (type === 'item') {
          const id = event.target.dataset.id;
          this.select(id);
      } else if (type === 'backdrop') {
          this.close();
      }
  }
  // геттер проверки класса
  get isOpen() {
      return this.$el.classList.contains('open');
  }
  // геттер проверки айди - актуальный элемент
  get current() {
      return this.options.data.find(item => item.id === this.selectedId);
  }

  //выбор элемента списка
  select(id) {
      this.selectedId = id;
      this.$value.textContent = this.current.value;
      this.$el.querySelectorAll(`[data-type="item"]`).forEach( el => {
          el.classList.remove('selected');
      });
      this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected');
      this.options.onSelect ? this.options.onSelect(this.current) : null;
      this.close();
  }

  // если класс опен закрыть иначе открыть
  toggle() {
      this.isOpen ? this.close() : this.open();
  }
  // открыть и поменять иконку 
  open() {
      this.$el.classList.add('open');
      this.$arrow.classList.remove('fa-chevron-down');
      this.$arrow.classList.add('fa-chevron-up');
  }
  // закрыть и поменять иконку
  close() {
      this.$el.classList.remove('open');
      this.$arrow.classList.add('fa-chevron-down');
      this.$arrow.classList.remove('fa-chevron-up');
  }
  // уничтожить
  destroy() {
      this.$el.removeEventListener('click', this.clickHandler);
      this.$el.remove();
  }
}

const select = new Select('#select', {
  placeholder: 'Вы можете выбрать элемент',
  //selectedId: '3',
  data: [
      {id: '1', value: 'React'},
      {id: '2', value: 'Angular'},
      {id: '3', value: 'Vue'},
      {id: '4', value: 'React Native'},
      {id: '5', value: 'Next'},
      {id: '6', value: 'Nest'}
  ],
  onSelect(item) {
      console.log('Selected item', item);
  }
});

window.s = select;

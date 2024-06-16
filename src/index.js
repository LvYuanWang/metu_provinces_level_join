(async () => {
  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch('https://study.duyiedu.com/api/citylist')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }

  $ = (select) => document.querySelector(select);
  const doms = {
    selProvince: $('#selProvince'),
    selCity: $('#selCity'),
    selArea: $('#selArea')
  }

  // 初始化: 生成li元素,加入到ul中
  const datas = await getDatas();
  fullSelect(doms.selProvince, datas);
  fullSelect(doms.selCity, []);
  fullSelect(doms.selArea, []);
  /**
   * 填充某个下拉列表
   * 该方法极具通用性,不仅是初始化可以调用,之后再某些事件中也可以调用
   * @param {Element} select 要填充的下拉列表
   * @param {Array} list 填充的数组
   */
  function fullSelect(select, list) {
    select.className = `select ${list.length ? '' : 'disabled'}`;
    const dataName = select.dataset.name;
    const span = select.querySelector('.title span');
    select.datas = list;
    span.innerText = `请选择${dataName}`;
    const ul = select.querySelector('.options');
    ul.innerHTML = list.map(item => `<li>${item.label}</li>`).join('');
  }
  regCommonEvent(doms.selProvince);
  regCommonEvent(doms.selCity);
  regCommonEvent(doms.selArea);
  regProvinceEvent();
  regCityEvent();
  /**
   * 注册公共事件处理函数
   * @param {Element} select 
   */
  function regCommonEvent(select) {
    // 1. title点击事件
    const title = select.querySelector('.title');
    title.addEventListener('click', () => {
      if (select.classList.contains('disabled')) {
        return;
      }
      const click = document.querySelectorAll('.select.click');
      for (const ele of click) {
        if (ele != select) {
          ele.classList.remove('click');
        }
      }
      select.classList.toggle('click');
    })
    // 2. ul点击事件
    const ul = select.querySelector('.options');
    ul.addEventListener('click', e => {
      if (e.target.nodeName === 'LI') {
        const active = ul.querySelector('li.active');
        active && active.classList.remove('active');
        const li = e.target;
        li.classList.add('active');
        const span = select.querySelector('.title span');
        span.innerText = li.innerText;
        select.classList.remove('click');
      }
    })
  }

  /**
   * 注册省份特殊点击事件
   */
  function regProvinceEvent() {
    const ul = doms.selProvince.querySelector('.options');
    ul.addEventListener('click', e => {
      if (e.target.nodeName === 'LI') {
        const City = doms.selProvince.datas.find(item => item.label === e.target.innerText);
        fullSelect(doms.selCity, City.children);
        fullSelect(doms.selArea, []);
      }
    })
  }
  /**
   * 注册城市特殊点击事件
   */
  function regCityEvent() {
    const ul = doms.selCity.querySelector('.options');
    ul.addEventListener('click', e => {
      if (e.target.nodeName === 'LI') {
        const Area = doms.selCity.datas.find(item => item.label === e.target.innerText);
        fullSelect(doms.selArea, Area.children);
      }
    })
  }
})()
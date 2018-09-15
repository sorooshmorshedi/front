import Panel from '@/components/panel/Panel';

import List from '@/components/panel/lists/List';

export default [{
  name: 'Lists',
  path: '/panel',
  component: Panel,
  children: [{
      name: 'List',
      path: 'lists/:form/:type?',
      component: List,
      props: true,
    }
  ]
}]

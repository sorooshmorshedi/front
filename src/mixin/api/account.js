export default {
  methods: {
    getAccounts() {
      return [{
        title: 'dc1',
        name: 'dc1 name',
        id: 1,
        code: 1,
        level: 1,
        children: [{
          title: 'dc 1.1',
          name: 'dc1',
          id: 2,
          code: 11,
          level: 2,
          children: [{
              title: 'dc 1.1.1',
              children: [{
                title: 'dc 1.1',
                children: [{
                    title: 'dc 1.1.1',
                  },
                  {
                    title: 'dc 1.1.2',
                  }, {
                    title: 'افزودن',
                  }
                ]
              }],
            },
            {
              title: 'dc 1.1.2',
            }, {
              oasdif: 'aopsifd',
              title: 'افزودن',
            }
          ]
        }],
      }, {
        title: 'ac1',
        children: [{
          title: 'ac 1.1',
          children: [{
              title: 'ac 1.1.1',
            },
            {
              title: 'ac 1.1.2',
            }, {
              title: 'ac 1.1.3',
            }
          ]
        }]
      }]
    },
    storeAccount(type, account) {},
    updateAccount(type, account) {},
    getAccountsForTree() {
      return this.getAccounts();
    }
  }
}

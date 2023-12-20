require('jest-fetch-mock').enableMocks()
require("@inrupt/jest-jsdom-polyfills")

if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    };
  }

  if (!global.chrome) {
    global.chrome = {
      runtime: {
        // Mock any functions or properties you need
        sendMessage: jest.fn(),
        onMessage: {
          addListener: jest.fn()
        },
        onConnect: {
          addListener: jest.fn()
        }
      },
      storage: {
        onChanged: {
          addListener: jest.fn()
        },
        local: {
          get: jest.fn(() => ({ panelOpen: true})),
          set: jest.fn()
        }
      },
      tabs: {
        query: jest.fn(() => [{ id: 1 }]),
        connect: jest.fn()
      }
    };
  }
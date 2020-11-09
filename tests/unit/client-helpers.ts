import {SerializedConfig} from "../../lib";

const uuidv4 = require("uuid").v4;
const MockAdapter = require('axios-mock-adapter');

function mockClient(axiosInstance, handlers) {
  const mockAdapter = new MockAdapter(axiosInstance);
  handlers.forEach(h => h(mockAdapter));
}

function randomKeyConfig() {
  return new SerializedConfig(uuidv4(), uuidv4());
}

function mockGetOk(matcher, response) {
  return (mock) => {
    mock.onGet(matcher).reply(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [200, response];
    });
  }
}

function mockPostOk(matcher, response) {
  return (mock) => {
    mock.onPost(matcher).reply(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [200, response];
    });
  }
}

module.exports = {mockClient, mockGetOk, mockPostOk, randomKeyConfig}

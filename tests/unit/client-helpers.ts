import {AxiosResponse} from "axios";

const uuidv4 = require("uuid").v4;
const MockAdapter = require('axios-mock-adapter');

function mockClient(axiosInstance, handlers) {
  const mockAdapter = new MockAdapter(axiosInstance);
  handlers.forEach(h => h(mockAdapter));
}

function randomKeyConfig() {
  return {accessKey: uuidv4(), secretAccessKey: uuidv4()};
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

function mockPutOk(matcher, response) {
  return (mock) => {
    mock.onPut(matcher).reply(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [200, response];
    });
  }
}

function mockGet(matcher, handler: (config) => AxiosResponse) {
  return (mock) => {
    mock.onGet(matcher).reply(async (config) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return handler(config);
    });
  }
}

function mockPost(matcher, handler: (config) => AxiosResponse) {
  return (mock) => {
    mock.onPost(matcher).reply(async (config) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return handler(config);
    });
  }
}

function mockPut(matcher, handler: (config) => AxiosResponse) {
  return (mock) => {
    mock.onPut(matcher).reply(async (config) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return handler(config);
    });
  }
}

module.exports = {mockClient, mockGetOk, mockPostOk, mockPutOk, mockGet, mockPut, mockPost, randomKeyConfig}

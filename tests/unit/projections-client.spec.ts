import {
  GetSingleProjectionResponse,
  ListSingleProjectionsResponse,
  ProjectionsClient,
  ProjectionsPaginationOptions,
  Serialized,
  SerializedInstance
} from "../../lib";
import {v4 as uuidv4} from 'uuid';
import {AxiosRequestConfig} from "axios";

const {mockClient} = require("./client-helpers");

function randomConfigKey() {
  return {accessKey: uuidv4(), secretAccessKey: uuidv4()};
}

describe('Projections client', () => {

  it('Can load single projection by id', async () => {

    const serializedInstance: SerializedInstance = Serialized.create(randomConfigKey())
    const projectionId = uuidv4();

    const projectionResponse: GetSingleProjectionResponse = {
      projectionId: projectionId,
      createdAt: 0,
      updatedAt: 0,
      data: {
        userName: 'johndoe'
      }
    };

    mockClient(
        serializedInstance.axiosClient,
        [
          (mock) => {
            const expectedUrl = ProjectionsClient.singleProjectionUrl('user-projection', projectionId);
            const matcher = RegExp(`^${expectedUrl}$`);
            mock.onGet(matcher).reply(async (config: AxiosRequestConfig) => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              return [200, projectionResponse];
            });
          }
        ]);

    const projection = await serializedInstance.projections.getSingleProjection({
      projectionId: projectionId,
      projectionName: 'user-projection'
    });

    expect(projection).toStrictEqual(projectionResponse)

  });

  it('Can list single projections', async () => {
    const serializedInstance: SerializedInstance = Serialized.create(randomConfigKey())

    const params: ProjectionsPaginationOptions = {
      skip: 0,
      limit: 10,
      sort: 'userName',
    };

    const zeroProjectionsResponse: ListSingleProjectionsResponse = {
      hasMore: false,
      projections: [],
      totalCount: 0
    }

    mockClient(
        serializedInstance.axiosClient,
        [
          (mock) => {
            const expectedUrl = ProjectionsClient.singleProjectionsUrl('user-projection');
            const matcher = RegExp(`^${expectedUrl}$`);
            mock.onGet(matcher).reply(async (config: AxiosRequestConfig) => {

              // Verify that the expected query params in the request are sent to the API
              expect(config.params).toEqual(params);

              await new Promise((resolve) => setTimeout(resolve, 300));
              return [200, zeroProjectionsResponse];
            });
          }
        ]);

    const projections = await serializedInstance.projections.listSingleProjections({
      projectionName: 'user-projection',
      limit: params.limit,
      skip: params.skip,
      sort: params.sort,
    });

    expect(projections).toStrictEqual(zeroProjectionsResponse)
  });

  it('Can load a projection definition', async () => {

    const serializedInstance = Serialized.create(randomConfigKey())

    const projectionDefinition = {
      feedName: 'todo-lists',
      projectionName: 'todo-list-summaries',
      handlers: [
        {
          eventType: 'TodoAddedEvent',
          functions: [
            {
              function: 'merge',
            }
          ],
        }
      ]
    };

    mockClient(
        serializedInstance.axiosClient,
        [
          (mock) => {
            const expectedUrl = ProjectionsClient.projectionDefinitionUrl('user-projection');
            const matcher = RegExp(`^${expectedUrl}$`);
            mock.onGet(matcher).reply(async (config: AxiosRequestConfig) => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              return [200, projectionDefinition];
            });
          }
        ]);

    const response = await serializedInstance.projections.getProjectionDefinition({projectionName: 'user-projection'});
    expect(response).toStrictEqual(projectionDefinition)
  })

})

import { Test, TestingModule } from "@nestjs/testing";
import { ParameterController } from "./parameter.controller";
import { PARAMETER_SERVICE, ParameterMessages } from "@app/shared";
import { of } from "rxjs";

describe("ParameterController", () => {
  let controller: ParameterController;
  let mockClientProxy: any;

  beforeEach(async () => {
    mockClientProxy = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParameterController],
      providers: [{ provide: PARAMETER_SERVICE, useValue: mockClientProxy }],
    }).compile();

    controller = module.get<ParameterController>(ParameterController);
  });

  it("delete -> devrait exécuter le message de suppression", (done) => {
    mockClientProxy.send.mockReturnValue(of({ success: true }));

    controller.delete(1).subscribe(() => {
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        ParameterMessages.DELETE_PARAMETER,
        1,
      );
      done();
    });
  });
});

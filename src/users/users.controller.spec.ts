import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(null);
    usersController = new UsersController(usersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          _id: '5f25cd9cfac88f00172d0384',
          email: 'admin@mail.com',
          name: 'Ivan Ivanov',
        },
        {
          _id: '5f25cdaffac88f00172d0385',
          email: 'user@mail.com',
          name: 'Petr Petrov',
        },
      ];
      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(async () => result);

      expect(await usersController.findAll()).toBe(result);
    });
  });
});

import { HttpStatus } from '@domain/enums/HttpStatus.enum';
import { CustomError } from '@domain/models/CustomError';
import { UserProvider } from '@providers/UserProvider';
import { Inject, Service } from 'typedi';

@Service()
export class UserService {
    constructor(@Inject() private readonly userProvider: UserProvider) {}

    async getUserByStaffNumber(staffNumber: string) {
        const user = await this.userProvider.findUserRecord(staffNumber);

        if (!user) {
            throw new CustomError(HttpStatus.NOT_FOUND, `User with staff number ${staffNumber} not found`);
        }

        return user;
    }
}
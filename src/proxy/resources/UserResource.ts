import {ErrorEnum} from '@domain/enums/Error.enum';
import {HttpStatus} from '@domain/enums/HttpStatus.enum';
import {Response as response} from '@domain/http/Response';
import {CustomError} from '@domain/models/CustomError';
import {UserService} from '@services/UserService';
import {Get, JsonController, Param} from 'routing-controllers';
import {Inject, Service} from 'typedi';
import {ConnectionBase} from "@domain/utils/ConnectionBase";

@Service()
@JsonController('/users')
export class UserResource extends ConnectionBase {
    constructor(@Inject() private readonly userService: UserService) {
        super();
    }

    @Get('/:staffNumber')
    async getUser(@Param('staffNumber') staffNumber: string) {
        try {
            await super.configure();

            console.debug('Calling `getUserByStaffNumber`');

            const user = await this.userService.getUserByStaffNumber(staffNumber);

            console.info('User found');

            return response.status(HttpStatus.OK).payload(user);
        } catch (err) {
            console.error('[ERROR]: getUser', {err});

            if (err instanceof CustomError && err.statusCode === HttpStatus.NOT_FOUND) {
                return response.status(HttpStatus.NOT_FOUND).payload({message: ErrorEnum.NOT_FOUND});
            }

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).payload({
                message: ErrorEnum.INTERNAL_SERVER_ERROR,
                error: ErrorEnum.ERROR_OCCURRED,
            });
        }
    }
}
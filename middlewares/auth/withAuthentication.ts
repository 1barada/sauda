import { RequestWithAuthorization } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import getServerUser from "@/utils/getServerUser";
import { MiddlewareFunction } from "../handler";

export const withAuthentication: MiddlewareFunction<RequestWithAuthorization> = async (req, next) => {
  const user = await getServerUser();

  if (!user) return {
    status: HttpStatus.UNAUTHORIZED,
    data: null,
    error: {
      message: 'not authorized'
    }
  };

  req.user = user;

  return next();
}
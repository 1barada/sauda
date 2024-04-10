import { MiddlewareFunction } from "./handler";
import getServerUser from "@/utils/getServerUser";
import { HttpException, RequestWithAuthorization } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";

export const withAuthentication: MiddlewareFunction<RequestWithAuthorization> = async (req, next) => {
  const user = await getServerUser();

  if (!user) throw new HttpException('not authorized', HttpStatus.UNAUTHORIZED);

  req.user = user;

  return next();
}
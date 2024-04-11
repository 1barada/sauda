import { RequestWithAuthorization, HttpException } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import getServerUser from "@/utils/getServerUser";
import { MiddlewareFunction } from "../handler";

export const withAuthentication: MiddlewareFunction<RequestWithAuthorization> = async (req, next) => {
  const user = await getServerUser();

  if (!user) throw new HttpException('not authorized', HttpStatus.UNAUTHORIZED);

  req.user = user;

  return next();
}
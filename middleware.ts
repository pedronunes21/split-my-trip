import { NxResponse } from "@/lib/nx-response";
import { ApiErrorCodes } from "@/lib/types";

export function middleware() {
    return NxResponse.fail('You are not authorized to access this page', {
        code: ApiErrorCodes.UNAUTHORIZED,
        details: 'You need to be logged in to access this page'
    })
}

export const config = {
    matcher: []
}
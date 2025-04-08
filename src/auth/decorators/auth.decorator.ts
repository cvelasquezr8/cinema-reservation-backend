import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';

// This decorator is used to protect routes with authentication and authorization
import { UserRoleGuard } from '@auth/guards/user-role.guard';
import { ValidRoles } from '@auth/interfaces';
import { RoleProtected } from '@auth/decorators/role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}

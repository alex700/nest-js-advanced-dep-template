import 'reflect-metadata';
import { randomInt } from 'node:crypto';
import { BadRequestException, Controller, Get, Module, Query } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { z } from 'zod';

const rollQuery = z.object({
  sides: z.coerce.number().int().min(2).max(100).default(6),
  count: z.coerce.number().int().min(1).max(10).default(1),
}).strict();

@Controller()
class DiceToyRoutes {
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('roll')
  roll(@Query() query: Record<string, unknown>) {
    const parsed = rollQuery.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException('Use integer sides (2–100) and count (1–10) only.');
    }
    const { sides, count } = parsed.data;
    const rolls = Array.from({ length: count }, () => randomInt(1, sides + 1));
    return { sides, rolls, total: rolls.reduce((sum, value) => sum + value, 0) };
  }
}

@Module({ controllers: [DiceToyRoutes] })
class DiceToyRoot {}

export function createDiceToy() {
  return NestFactory.create(DiceToyRoot, { logger: false });
}

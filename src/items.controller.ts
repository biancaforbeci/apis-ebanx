import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('')
export class ItemsController {
  private items = [];

  @Post('reset')
  reset() {
    this.items = [];
    return { message: 'Items array has been reset' };
  }
} 
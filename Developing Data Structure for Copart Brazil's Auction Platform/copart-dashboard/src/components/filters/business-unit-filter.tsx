'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BusinessUnitFilter() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Unidade de Negócio" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as Unidades</SelectItem>
        <SelectItem value="leiloes">Leilões (Core)</SelectItem>
        <SelectItem value="venda_direta">Venda Direta</SelectItem>
      </SelectContent>
    </Select>
  );
}

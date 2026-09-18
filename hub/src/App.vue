<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <Button>Click me</Button>
    <Button :variant="'secondary'">Secondary</Button>
    <Button :variant="'destructive'">Destructive</Button>
    <Button :variant="'ghost'">Ghost</Button>
    <Button :variant="'outline'">Outline</Button>
  </div>
</template>

export function isFile(file: unknown): boolean {
  return (typeof file === 'object' && file !== null && 'name' in file && 'size' in file && 'type' in file);
}
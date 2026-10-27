export function rotate(rotation: number): number {
	return (rotation + 1) % 4;
}

// Each elbow starts with connections north and east, rotated clockwise.
export function isLoop(rotations: readonly number[]): boolean {
	return (
		rotations.length === 4 &&
		rotations.every((rotation, index) => rotation === [1, 2, 0, 3][index])
	);
}

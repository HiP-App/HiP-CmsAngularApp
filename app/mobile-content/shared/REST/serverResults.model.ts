
export class AllEntities<T> {

	constructor(public total: number,
				public entities: T[]) {
	}

}

export class AllIds {
	constructor(public ids: number[]) {
	}
}

export class Entity<T> {
	constructor(public entitie: T) {
	}
}

export class Create {
	constructor(public id: number) {}
}

export class Update {

}

export class Delete {

}


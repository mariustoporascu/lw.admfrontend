import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BehaviorSubject,
	map,
	Observable,
	of,
	switchMap,
	take,
	tap,
	throwError,
} from 'rxjs';
import { Item, Items } from './file-manager.types';
import { fileManagerData } from './file-manager.data';

@Injectable({
	providedIn: 'root',
})
export class FileManagerService {
	// Private
	private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
	private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
	private _fileManagerData: any[] = fileManagerData;
	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for items
	 */
	get Items$(): Observable<Items> {
		return this._items.asObservable();
	}

	/**
	 * Getter for item
	 */
	get Item$(): Observable<Item> {
		return this._item.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get items
	 */
	public setItems(folderId: string | null = null) {
		folderId = folderId || null;
		let items = [...this._fileManagerData];
		// Filter the items by folder id. If folder id is null,
		// that means we want to root items which have folder id
		// of null
		items = items.filter((item) => item.folderId === folderId);

		// Separate the items by folders and files
		const folders = items.filter((item) => item.type === 'folder');
		const files = items.filter((item) => item.type !== 'folder');

		// Sort the folders and files alphabetically by filename
		folders.sort((a, b) => a.name.localeCompare(b.name));
		files.sort((a, b) => a.name.localeCompare(b.name));

		// Figure out the path and attach it to the response
		// Prepare the empty paths array
		const pathItems = [...this._fileManagerData];
		const path = [];

		// Prepare the current folder
		let currentFolder = null;

		// Get the current folder and add it as the first entry
		if (folderId) {
			currentFolder = pathItems.find((item) => item.id === folderId);
			path.push(currentFolder);
		}

		// Start traversing and storing the folders as a path array
		// until we hit null on the folder id
		while (currentFolder?.folderId) {
			currentFolder = pathItems.find((item) => item.id === currentFolder.folderId);
			if (currentFolder) {
				path.unshift(currentFolder);
			}
		}
		this._items.next({ folders, files, path });
		return this.Items$;
	}

	/**
	 * Get item by id
	 */
	public setItemById(id: string) {
		const item =
			[...this._items.value.folders, ...this._items.value.files].find(
				(value) => value.id === id
			) || null;

		// Update the item
		this._item.next(item);
		return this.Item$;
	}
}

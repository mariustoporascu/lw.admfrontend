import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Item, Items } from './file-manager.types';
import { backendUrl } from '../config/app.config';
import { Documente, FirmaDiscount } from '../bkendmodels/models.types';

@Injectable({
	providedIn: 'root',
})
export class FileManagerService {
	// Private
	private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
	private _folders: BehaviorSubject<Item[] | null> = new BehaviorSubject(null);
	private _files: BehaviorSubject<Item[] | null> = new BehaviorSubject(null);
	private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
	private _backEndUrl: string = backendUrl;

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
	 * Set items
	 */
	public setItems(firmaDiscountId: string | null = null) {
		firmaDiscountId = firmaDiscountId || null;

		// Separate the items by folders and files
		const folders = this._folders.value.filter((item) =>
			firmaDiscountId ? false : true
		);
		const files = this._files.value.filter((item) =>
			firmaDiscountId ? item.folderId === firmaDiscountId : false
		);
		// Sort the folders and files alphabetically by filename
		folders.sort((a, b) => a.folderInfo.name.localeCompare(b.folderInfo.name));
		files.sort((a, b) =>
			a.fileInfo.uploaded
				.getTime()
				.toString()
				.localeCompare(b.fileInfo.uploaded.getTime().toString())
		);

		// Figure out the path and attach it to the response
		// Prepare the empty paths array
		const path = [];

		// Prepare the current folder
		let currentFolder = null;

		// Get the current folder and add it as the first entry
		if (firmaDiscountId) {
			currentFolder = this._folders.value.find(
				(item) => item.id === firmaDiscountId
			);
			path.push(currentFolder);
		}

		// Start traversing and storing the folders as a path array
		// until we hit null on the folder id
		while (currentFolder?.folderId) {
			currentFolder = this._folders.value.find(
				(item) => item.id === currentFolder.folderId
			);
			if (currentFolder) {
				path.unshift(currentFolder);
			}
		}
		this._items.next({ folders, files, path });
		return this.Items$;
	}

	/**
	 * Set item by id
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

	/**
	 * Get folders and items
	 */
	public getFolders(): Observable<FirmaDiscount[]> {
		return this._httpClient
			.get<FirmaDiscount[]>(`${this._backEndUrl}/regularuser/getallfolders`)
			.pipe(
				tap((data) => {
					let folders = data.map((item) => {
						let folder = {
							id: item.id,
							folderId: null,
							folderInfo: item,
							type: 'folder',
						} as Item;
						return folder;
					});
					this._folders.next(folders);
				})
			);
	}
	public getFiles(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/regularuser/getAllDocumente`)
			.pipe(
				tap((data) => {
					let files = data.map((item) => {
						item.uploaded = new Date(item.uploaded);
						let file = {
							id: item.id,
							folderId: item.firmaDiscountId,
							fileInfo: item,
							type: 'PDF', // item.fisiereDocumente.fileExtension
						} as Item;
						return file;
					});
					this._files.next(files);
				})
			);
	}
}

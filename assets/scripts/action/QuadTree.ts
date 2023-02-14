/**
 * quadtree-js
 * @version 1.2.3
 * @license MIT
 * @author Timo Hausmann
 */

import { Node, Rect } from 'cc';
import UtilsCC from '../utils/UtilsCC';

/* https://github.com/timohausmann/quadtree-js.git v1.2.3 */

/*
Copyright © 2012-2020 Timo Hausmann
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class Quadtree {
    public maxObjects: number;
    public maxLevels: number;
    public level: number;
    public bounds: Rect;
    public objects: Node[] = [];
    public nodes: Quadtree[] = [];
    /**
     * Quadtree Constructor
     * @param Object bounds            bounds of the node { x, y, width, height }
     * @param Integer maxObjects      (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
     * @param Integer maxLevels       (optional) total max levels inside root Quadtree (default: 4)
     * @param Integer level            (optional) depth level, required for subnodes (default: 0)
     */
    public constructor(bounds: Rect, maxObjects?: number, maxLevels?: number, level?: number) {
        this.maxObjects = maxObjects || 10;
        this.maxLevels = maxLevels || 4;

        this.level = level || 0;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = [];
    }

    /**
     * Split the node into 4 subnodes
     */
    private split() {
        const nextLevel = this.level + 1;
            const subWidth = this.bounds.width / 2;
            const subHeight = this.bounds.height / 2;
            const x = this.bounds.x;
            const y = this.bounds.y;

        // top right node
        this.nodes[0] = new Quadtree(new Rect(x + subWidth, y, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);

        // top left node
        this.nodes[1] = new Quadtree(new Rect(x, y, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);

        // bottom left node
        this.nodes[2] = new Quadtree(new Rect(x, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);

        // bottom right node
        this.nodes[3] = new Quadtree(new Rect(x + subWidth, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);
    }

    /**
     * Determine which node the object belongs to
     * @param Object pRect      bounds of the area to be checked, with x, y, width, height
     * @return Array            an array of indexes of the intersecting subnodes
     *                          (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     */
    private getIndex(node: Node) {
        const pRect = UtilsCC.getBoundingBox(node);
        const indexes: number[] = [];
            const verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
            const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

        const startIsNorth = pRect.y < horizontalMidpoint;
            const startIsWest = pRect.x < verticalMidpoint;
            const endIsEast = pRect.x + pRect.width > verticalMidpoint;
            const endIsSouth = pRect.y + pRect.height > horizontalMidpoint;

        // top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }

        // top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }

        // bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }

        // bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }

        return indexes;
    }

    /**
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param Object pRect        bounds of the object to be added { x, y, width, height }
     */
    public insert(node: Node): void {
        let i = 0;
        let indexes: number[] = [];

        // if we have subnodes, call insert on matching subnodes
        if (this.nodes.length) {
            indexes = this.getIndex(node);

            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(node);
            }
            return;
        }

        // otherwise, store object here
        this.objects.push(node);

        // maxObjects reached
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            // split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }

            // add all objects to their corresponding subnode
            for (i = 0; i < this.objects.length; i++) {
                indexes = this.getIndex(this.objects[i]);
                for (let k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }

            // clean up this node
            this.objects = [];
        }
    }

    /**
     * Return all objects that could collide with the given object
     * @param Object pRect      bounds of the object to be checked { x, y, width, height }
     * @return Array            array with all detected objects
     */
    public retrieve(node: Node): Node[] {
        const indexes = this.getIndex(node);
            let returnObjects = this.objects;

        // if we have subnodes, retrieve their objects
        if (this.nodes.length) {
            for (let i = 0; i < indexes.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(node));
            }
        }

        // remove duplicates
        returnObjects = returnObjects.filter((item, index) => returnObjects.indexOf(item) >= index);

        return returnObjects;
    }

    /**
     * Clear the quadtree
     */
    public clear(): void {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}

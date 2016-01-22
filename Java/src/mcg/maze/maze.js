/**
 * 
 */
var MersenneTwister;
MersenneTwister = (function() {
	a.prototype.N = 624;
	a.prototype.M = 397;
	a.prototype.MATRIX_A = 2567483615;
	a.prototype.UPPER_MASK = 2147483648;
	a.prototype.LOWER_MASK = 2147483647;
	function a(b) {
		this.mt = new Array(this.N);
		this.setSeed(b)
	}
	a.prototype.unsigned32 = function(b) {
		if (b < 0) {
			return (b ^ this.UPPER_MASK) + this.UPPER_MASK
		} else {
			return b
		}
	};
	a.prototype.subtraction32 = function(c, b) {
		if (c < b) {
			return this.unsigned32((4294967296 - (b - c)) % 4294967295)
		} else {
			return c - b
		}
	};
	a.prototype.addition32 = function(c, b) {
		return this.unsigned32((c + b) & 4294967295)
	};
	a.prototype.multiplication32 = function(e, c) {
		var b, d, f;
		d = 0;
		for (b = f = 0; f < 32; b = ++f) {
			if ((e >>> b) & 1) {
				d = this.addition32(d, this.unsigned32(c << b))
			}
		}
		return d
	};
	a.prototype.setSeed = function(b) {
		if (!b || typeof b === "number") {
			return this.seedWithInteger(b)
		} else {
			return this.seedWithArray(b)
		}
	};
	a.prototype.defaultSeed = function() {
		var b;
		b = new Date();
		return b.getMinutes() * 60000 + b.getSeconds() * 1000
				+ b.getMilliseconds()
	};
	a.prototype.seedWithInteger = function(c) {
		var b;
		this.seed = c != null ? c : this.defaultSeed();
		this.mt[0] = this.unsigned32(this.seed & 4294967295);
		this.mti = 1;
		b = [];
		while (this.mti < this.N) {
			this.mt[this.mti] = this.addition32(this.multiplication32(
					1812433253, this.unsigned32(this.mt[this.mti - 1]
							^ (this.mt[this.mti - 1] >>> 30))), this.mti);
			this.mti[this.mti] = this
					.unsigned32(this.mt[this.mti] & 4294967295);
			b.push(this.mti++)
		}
		return b
	};
	a.prototype.seedWithArray = function(f) {
		var e, d, b, c;
		this.seedWithInteger(19650218);
		e = 1;
		d = 0;
		b = this.N > f.length ? this.N : f.length;
		while (b > 0) {
			c = this.multiplication32(this.unsigned32(this.mt[e - 1]
					^ (this.mt[e - 1] >>> 30)), 1664525);
			this.mt[e] = this.addition32(this.addition32(this
					.unsigned32(this.mt[e] ^ c), f[d]), d);
			this.mt[e] = this.unsigned32(this.mt[e] & 4294967295);
			e++;
			d++;
			if (e >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				e = 1
			}
			if (d >= f.length) {
				d = 0
			}
			b--
		}
		b = this.N - 1;
		while (b > 0) {
			this.mt[e] = this.subtraction32(this.unsigned32(this.mt[e]
					^ this.multiplication32(this.unsigned32(this.mt[e - 1]
							^ (this.mt[e - 1] >>> 30)), 1566083941)), e);
			this.mt[e] = this.unsigned32(this.mt[e] & 4294967295);
			e++;
			if (e >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				e = 1
			}
		}
		return this.mt[0] = 2147483648
	};
	a.prototype.nextInteger = function(b) {
		var c, d, e;
		if ((b != null ? b : 1) < 1) {
			return 0
		}
		d = [ 0, this.MATRIX_A ];
		if (this.mti >= this.N) {
			c = 0;
			while (c < this.N - this.M) {
				e = this.unsigned32((this.mt[c] & this.UPPER_MASK)
						| (this.mt[c + 1] & this.LOWER_MASK));
				this.mt[c] = this.unsigned32(this.mt[c + this.M] ^ (e >>> 1)
						^ d[e & 1]);
				c++
			}
			while (c < this.N - 1) {
				e = this.unsigned32((this.mt[c] & this.UPPER_MASK)
						| (this.mt[c + 1] & this.LOWER_MASK));
				this.mt[c] = this.unsigned32(this.mt[c + this.M - this.N]
						^ (e >>> 1) ^ d[e & 1]);
				c++
			}
			e = this.unsigned32((this.mt[this.N - 1] & this.UPPER_MASK)
					| (this.mt[0] & this.LOWER_MASK));
			this.mt[this.N - 1] = this.unsigned32(this.mt[this.M - 1]
					^ (e >>> 1) ^ d[e & 1]);
			this.mti = 0
		}
		e = this.mt[this.mti++];
		e = this.unsigned32(e ^ (e >>> 11));
		e = this.unsigned32(e ^ ((e << 7) & 2636928640));
		e = this.unsigned32(e ^ ((e << 15) & 4022730752));
		return this.unsigned32(e ^ (e >>> 18)) % (b != null ? b : 4294967296)
	};
	a.prototype.nextFloat = function() {
		return this.nextInteger() / 4294967295
	};
	a.prototype.nextBoolean = function() {
		return this.nextInteger() % 2 === 0
	};
	return a
})();

//----------------------------------------

var Maze;
Maze = (function() {
	function a(e, b, c, d) {
		this.width = e;
		this.height = b;
		if (d == null) {
			d = {}
		}
		this.grid = new a.Grid(this.width, this.height);
		this.rand = d.rng || new MersenneTwister(d.seed);
		this.isWeave = d.weave;
		if (this.rand.randomElement == null) {
			this.rand.randomElement = function(f) {
				return f[this.nextInteger(f.length)]
			};
			this.rand.removeRandomElement = function(g) {
				var f;
				f = g.splice(this.nextInteger(g.length), 1);
				if (f) {
					return f[0]
				}
			};
			this.rand.randomizeList = function(k) {
				var g, f, h;
				g = k.length - 1;
				while (g > 0) {
					f = this.nextInteger(g + 1);
					h = [ k[f], k[g] ], k[g] = h[0], k[f] = h[1];
					g--
				}
				return k
			};
			this.rand.randomDirections = function() {
				return this.randomizeList(a.Direction.List.slice(0))
			}
		}
		this.algorithm = new c(this, d)
	}
	a.prototype.onUpdate = function(b) {
		return this.algorithm.onUpdate(b)
	};
	a.prototype.onEvent = function(b) {
		return this.algorithm.onEvent(b)
	};
	a.prototype.generate = function() {
		var b;
		b = [];
		while (true) {
			if (!this.step()) {
				break
			} else {
				b.push(void 0)
			}
		}
		return b
	};
	a.prototype.step = function() {
		return this.algorithm.step()
	};
	a.prototype.isEast = function(b, c) {
		return this.grid.isMarked(b, c, a.Direction.E)
	};
	a.prototype.isWest = function(b, c) {
		return this.grid.isMarked(b, c, a.Direction.W)
	};
	a.prototype.isNorth = function(b, c) {
		return this.grid.isMarked(b, c, a.Direction.N)
	};
	a.prototype.isSouth = function(b, c) {
		return this.grid.isMarked(b, c, a.Direction.S)
	};
	a.prototype.isUnder = function(b, c) {
		return this.grid.isMarked(b, c, a.Direction.U)
	};
	a.prototype.isValid = function(b, c) {
		return (0 <= b && b < this.width) && (0 <= c && c < this.height)
	};
	a.prototype.carve = function(b, d, c) {
		return this.grid.mark(b, d, c)
	};
	a.prototype.uncarve = function(b, d, c) {
		return this.grid.clear(b, d, c)
	};
	a.prototype.isSet = function(b, d, c) {
		return this.grid.isMarked(b, d, c)
	};
	a.prototype.isBlank = function(b, c) {
		return this.grid.at(b, c) === 0
	};
	a.prototype.isPerpendicular = function(b, d, c) {
		return (this.grid.at(b, d) & a.Direction.Mask) === a.Direction.cross[c]
	};
	return a
})();

Maze.Algorithms = {};
Maze.Algorithm = (function() {
	function a(c, b) {
		this.maze = c;
		if (b == null) {
			b = {}
		}
		this.updateCallback = function(f, d, e) {
		};
		this.eventCallback = function(f, d, e) {
		};
		this.rand = this.maze.rand
	}
	a.prototype.onUpdate = function(b) {
		return this.updateCallback = b
	};
	a.prototype.onEvent = function(b) {
		return this.eventCallback = b
	};
	a.prototype.updateAt = function(b, c) {
		return this.updateCallback(this.maze, parseInt(b), parseInt(c))
	};
	a.prototype.eventAt = function(b, c) {
		return this.eventCallback(this.maze, parseInt(b), parseInt(c))
	};
	a.prototype.canWeave = function(c, e, d) {
		var b, f;
		if (this.maze.isWeave && this.maze.isPerpendicular(e, d, c)) {
			b = e + Maze.Direction.dx[c];
			f = d + Maze.Direction.dy[c];
			return this.maze.isValid(b, f) && this.maze.isBlank(b, f)
		}
	};
	a.prototype.performThruWeave = function(c, b) {
		if (this.rand.nextBoolean()) {
			return this.maze.carve(c, b, Maze.Direction.U)
		} else {
			if (this.maze.isNorth(c, b)) {
				this.maze.uncarve(c, b, Maze.Direction.N | Maze.Direction.S);
				return this.maze.carve(c, b, Maze.Direction.E
						| Maze.Direction.W | Maze.Direction.U)
			} else {
				this.maze.uncarve(c, b, Maze.Direction.E | Maze.Direction.W);
				return this.maze.carve(c, b, Maze.Direction.N
						| Maze.Direction.S | Maze.Direction.U)
			}
		}
	};
	a.prototype.performWeave = function(b, i, f, h) {
		var d, c, g, e;
		d = i + Maze.Direction.dx[b];
		c = f + Maze.Direction.dy[b];
		g = d + Maze.Direction.dx[b];
		e = c + Maze.Direction.dy[b];
		this.maze.carve(i, f, b);
		this.maze.carve(g, e, Maze.Direction.opposite[b]);
		this.performThruWeave(d, c);
		if (h) {
			h(g, e)
		}
		this.updateAt(i, f);
		this.updateAt(d, c);
		return this.updateAt(g, e)
	};
	return a
})();

Maze.Direction = {
	N : 1,
	S : 2,
	E : 4,
	W : 8,
	U : 16,
	Mask : 1 | 2 | 4 | 8 | 16,
	List : [ 1, 2, 4, 8 ],
	dx : {
		1 : 0,
		2 : 0,
		4 : 1,
		8 : -1
	},
	dy : {
		1 : -1,
		2 : 1,
		4 : 0,
		8 : 0
	},
	opposite : {
		1 : 2,
		2 : 1,
		4 : 8,
		8 : 4
	},
	cross : {
		1 : 4 | 8,
		2 : 4 | 8,
		4 : 1 | 2,
		8 : 1 | 2
	}
};

Maze.Grid = (function() {
	function a(d, c) {
		var b, e;
		this.width = d;
		this.height = c;
		this.data = (function() {
			var h, g, f;
			f = [];
			for (e = h = 1, g = this.height; 1 <= g ? h <= g : h >= g; e = 1 <= g ? ++h
					: --h) {
				f
						.push((function() {
							var k, i, j;
							j = [];
							for (b = k = 1, i = this.width; 1 <= i ? k <= i
									: k >= i; b = 1 <= i ? ++k : --k) {
								j.push(0)
							}
							return j
						}).call(this))
			}
			return f
		}).call(this)
	}
	a.prototype.at = function(b, c) {
		return this.data[c][b]
	};
	a.prototype.mark = function(b, d, c) {
		return this.data[d][b] |= c
	};
	a.prototype.clear = function(b, d, c) {
		return this.data[d][b] &= ~c
	};
	a.prototype.isMarked = function(b, d, c) {
		return (this.data[d][b] & c) === c
	};
	return a
})();
Maze.createWidget = function(i, c, m, o) {
	var k, f, n, j, g, b, l, d, a, h, e;
	if (o == null) {
		o = {}
	}
	a = function(s, p, r, q) {
		if (s.isEast(p, r)) {
			q.push("e")
		}
		if (s.isWest(p, r)) {
			q.push("w")
		}
		if (s.isSouth(p, r)) {
			q.push("s")
		}
		if (s.isNorth(p, r)) {
			q.push("n")
		}
		if (s.isUnder(p, r)) {
			return q.push("u")
		}
	};
	k = {
		AldousBroder : function(s, p, r, q) {
			if (s.algorithm.isCurrent(p, r)) {
				return q.push("cursor")
			} else {
				if (!s.isBlank(p, r)) {
					q.push("in");
					return a(s, p, r, q)
				}
			}
		},
		GrowingTree : function(s, p, r, q) {
			if (!s.isBlank(p, r)) {
				if (s.algorithm.inQueue(p, r)) {
					q.push("f")
				} else {
					q.push("in")
				}
				return a(s, p, r, q)
			}
		},
		GrowingBinaryTree : function(s, p, r, q) {
			return k.GrowingTree(s, p, r, q)
		},
		HuntAndKill : function(s, p, r, q) {
			if (s.algorithm.isCurrent(p, r)) {
				q.push("cursor")
			}
			if (!s.isBlank(p, r)) {
				q.push("in");
				return a(s, p, r, q)
			}
		},
		Prim : function(s, p, r, q) {
			if (s.algorithm.isFrontier(p, r)) {
				return q.push("f")
			} else {
				if (s.algorithm.isInside(p, r)) {
					q.push("in");
					return a(s, p, r, q)
				}
			}
		},
		RecursiveBacktracker : function(s, p, r, q) {
			if (s.algorithm.isStack(p, r)) {
				q.push("f")
			} else {
				q.push("in")
			}
			return a(s, p, r, q)
		},
		RecursiveDivision : function(s, p, r, q) {
			return a(s, p, r, q)
		},
		Wilson : function(s, p, r, q) {
			if (s.algorithm.isCurrent(p, r)) {
				q.push("cursor");
				return a(s, p, r, q)
			} else {
				if (!s.isBlank(p, r)) {
					q.push("in");
					return a(s, p, r, q)
				} else {
					if (s.algorithm.isVisited(p, r)) {
						return q.push("f")
					}
				}
			}
		},
		Houston : function(s, p, r, q) {
			if (s.algorithm.worker.isVisited != null) {
				return k.Wilson(s, p, r, q)
			} else {
				return k.AldousBroder(s, p, r, q)
			}
		},
		"default" : function(s, p, r, q) {
			if (!s.isBlank(p, r)) {
				q.push("in");
				return a(s, p, r, q)
			}
		}
	};
	d = function(t, q, s) {
		var p, r;
		r = [];
		(k[i] || k["default"])(t, q, s, r);
		p = document.getElementById("" + t.element.id + "_y" + s + "x" + q);
		return p.className = r.join(" ")
	};
	n = function(r, p, q) {
		if (r.element.quickStep) {
			return r.element.mazePause()
		}
	};
	b = o.id || i.toLowerCase();
	if (o.interval == null) {
		o.interval = 50
	}
	l = "maze";
	if (o["class"]) {
		l += " " + o["class"]
	}
	j = "grid";
	if (o.wallwise) {
		j += " invert"
	}
	if (o.padded) {
		j += " padded"
	}
	if ((e = o.watch) != null ? e : true) {
		h = "<a id='" + b
				+ "_watch' href='#' onclick='document.getElementById(\"" + b
				+ "\").mazeQuickStep(); return false;'>Watch</a>"
	} else {
		h = ""
	}
	g = '<div id="' + b + '" class="' + l + '">\n  <div id="' + b
			+ '_grid" class="' + j
			+ '"></div>\n  <div class="operations">\n    <a id="' + b
			+ '_reset" href="#" onclick="document.getElementById(\'' + b
			+ '\').mazeReset(); return false;">Reset</a>\n    <a id="' + b
			+ '_step" href="#" onclick="document.getElementById(\'' + b
			+ "').mazeStep(); return false;\">Step</a>\n    " + h
			+ '\n    <a id="' + b
			+ '_run" href="#" onclick="document.getElementById(\'' + b
			+ "').mazeRun(); return false;\">Run</a>\n  </div>\n</div>";
	document.write(g);
	f = document.getElementById(b);
	f.addClassName = function(s, q) {
		var r, u, t, p;
		u = s.className.split(" ");
		for (t = 0, p = u.length; t < p; t++) {
			r = u[t];
			if (r === q) {
				return
			}
		}
		return s.className += " " + q
	};
	f.removeClassName = function(t, r) {
		var s, v, u, q, p;
		if (t.className.length > 0) {
			v = t.className.split(" ");
			t.className = "";
			p = [];
			for (u = 0, q = v.length; u < q; u++) {
				s = v[u];
				if (s !== r) {
					if (t.className.length > 0) {
						t.className += " "
					}
					p.push(t.className += s)
				} else {
					p.push(void 0)
				}
			}
			return p
		}
	};
	f.mazePause = function() {
		if (this.mazeStepInterval != null) {
			clearInterval(this.mazeStepInterval);
			this.mazeStepInterval = null;
			this.quickStep = false;
			return true
		}
	};
	f.mazeRun = function() {
		if (!this.mazePause()) {
			return this.mazeStepInterval = setInterval(((function(p) {
				return function() {
					return p.mazeStep()
				}
			})(this)), o.interval)
		}
	};
	f.mazeStep = function() {
		var p;
		if (!this.maze.step()) {
			this.mazePause();
			this.addClassName(document.getElementById("" + this.id + "_step"),
					"disabled");
			if ((p = o.watch) != null ? p : true) {
				this.addClassName(document.getElementById("" + this.id
						+ "_watch"), "disabled")
			}
			return this.addClassName(document.getElementById("" + this.id
					+ "_run"), "disabled")
		}
	};
	f.mazeQuickStep = function() {
		this.quickStep = true;
		return this.mazeRun()
	};
	f.mazeReset = function() {
		var p, w, q, B, A, z, v, u, t, s, r;
		this.mazePause();
		if (typeof o.input === "function") {
			B = o.input()
		} else {
			B = o.input
		}
		this.maze = new Maze(c, m, Maze.Algorithms[i], {
			seed : o.seed,
			rng : o.rng,
			input : B,
			weave : o.weave,
			weaveMode : o.weaveMode,
			weaveDensity : o.weaveDensity
		});
		this.maze.element = this;
		this.maze.onUpdate(d);
		this.maze.onEvent(n);
		p = "";
		for (z = v = 0, t = this.maze.height; 0 <= t ? v < t : v > t; z = 0 <= t ? ++v
				: --v) {
			q = "" + this.id + "_y" + z;
			p += "<div class='row' id='" + q + "'>";
			for (A = u = 0, s = this.maze.width; 0 <= s ? u < s : u > s; A = 0 <= s ? ++u
					: --u) {
				p += "<div id='" + q + "x" + A + "'>";
				if (o.padded) {
					p += "<div class='np'></div>";
					p += "<div class='wp'></div>";
					p += "<div class='ep'></div>";
					p += "<div class='sp'></div>";
					p += "<div class='c'></div>"
				}
				p += "</div>"
			}
			p += "</div>"
		}
		w = document.getElementById("" + this.id + "_grid");
		w.innerHTML = p;
		this.removeClassName(document.getElementById("" + this.id + "_step"),
				"disabled");
		if ((r = o.watch) != null ? r : true) {
			this.removeClassName(document.getElementById("" + this.id
					+ "_watch"), "disabled")
		}
		return this.removeClassName(document.getElementById("" + this.id
				+ "_run"), "disabled")
	};
	return f.mazeReset()
};
Maze.createCanvasWidget = function(s, q, m, d) {
	var i, c, e, l, f, a, n, r, j, o, p, g, t, k, h, b;
	if (d == null) {
		d = {}
	}
	g = (h = d.styles) != null ? h : {};
	if (g.blank == null) {
		g.blank = "#ccc"
	}
	if (g.f == null) {
		g.f = "#faa"
	}
	if (g.a == null) {
		g.a = "#faa"
	}
	if (g.b == null) {
		g.b = "#afa"
	}
	if (g["in"] == null) {
		g["in"] = "#fff"
	}
	if (g.cursor == null) {
		g.cursor = "#7f7"
	}
	if (g.wall == null) {
		g.wall = "#000"
	}
	i = {
		AldousBroder : function(w, u, v) {
			if (w.algorithm.isCurrent(u, v)) {
				return g.cursor
			} else {
				if (!w.isBlank(u, v)) {
					return g["in"]
				}
			}
		},
		GrowingTree : function(w, u, v) {
			if (!w.isBlank(u, v)) {
				if (w.algorithm.inQueue(u, v)) {
					return g.f
				} else {
					return g["in"]
				}
			}
		},
		GrowingBinaryTree : function(w, u, v) {
			return i.GrowingTree(w, u, v)
		},
		HuntAndKill : function(w, u, v) {
			if (w.algorithm.isCurrent(u, v)) {
				return g.cursor
			} else {
				if (!w.isBlank(u, v)) {
					return g["in"]
				}
			}
		},
		Prim : function(w, u, v) {
			if (w.algorithm.isFrontier(u, v)) {
				return g.f
			} else {
				if (w.algorithm.isInside(u, v)) {
					return g["in"]
				}
			}
		},
		RecursiveBacktracker : function(w, u, v) {
			if (w.algorithm.isStack(u, v)) {
				return g.f
			} else {
				if (!w.isBlank(u, v)) {
					return g["in"]
				}
			}
		},
		RecursiveDivision : function(w, u, v) {
		},
		Wilson : function(w, u, v) {
			if (w.algorithm.isCurrent(u, v)) {
				return g.cursor
			} else {
				if (!w.isBlank(u, v)) {
					return g["in"]
				} else {
					if (w.algorithm.isVisited(u, v)) {
						return g.f
					}
				}
			}
		},
		Houston : function(w, u, v) {
			if (w.algorithm.worker != null) {
				if (w.algorithm.worker.isVisited != null) {
					return i.Wilson(w, u, v)
				} else {
					return i.AldousBroder(w, u, v)
				}
			}
		},
		BlobbyDivision : function(w, u, v) {
			switch (w.algorithm.stateAt(u, v)) {
			case "blank":
				return g.blank;
			case "in":
				return g["in"];
			case "active":
				return g.f;
			case "a":
				return g.a;
			case "b":
				return g.b
			}
		},
		"default" : function(w, u, v) {
			if (!w.isBlank(u, v)) {
				return g["in"]
			}
		}
	};
	l = function(u, w, y, v, x) {
		u.moveTo(w, y);
		return u.lineTo(v, x)
	};
	c = function(F, E, B) {
		var w, u, v, D, G, C, A, z;
		G = E * F.cellWidth;
		C = B * F.cellHeight;
		z = E === 0 ? G + 0.5 : G - 0.5;
		D = B === 0 ? C + 0.5 : C - 0.5;
		v = G - 0.5;
		A = C - 0.5;
		u = i[s] || i["default"];
		w = u(F, E, B);
		if (w == null) {
			w = (d.wallwise ? g["in"] : g.blank)
		}
		F.context.fillStyle = w;
		F.context.fillRect(G, C, F.cellWidth, F.cellHeight);
		F.context.beginPath();
		if (F.isWest(E, B) === (d.wallwise != null)) {
			l(F.context, z, C, z, C + F.cellHeight)
		}
		if (F.isEast(E, B) === (d.wallwise != null)) {
			l(F.context, v + F.cellWidth, C, v + F.cellWidth, C + F.cellHeight)
		}
		if (F.isNorth(E, B) === (d.wallwise != null)) {
			l(F.context, G, D, G + F.cellWidth, D)
		}
		if (F.isSouth(E, B) === (d.wallwise != null)) {
			l(F.context, G, A + F.cellHeight, G + F.cellWidth, A + F.cellHeight)
		}
		F.context.closePath();
		return F.context.stroke()
	};
	e = function(H, G, F) {
		var B, v, E, D, C, A, z, w, u, I;
		E = G * H.cellWidth;
		D = E + H.insetWidth - 0.5;
		A = E + H.cellWidth - 0.5;
		C = A - H.insetWidth;
		z = F * H.cellHeight;
		w = z + H.insetHeight - 0.5;
		I = z + H.cellHeight - 0.5;
		u = I - H.insetHeight;
		E = G === 0 ? E + 0.5 : E - 0.5;
		z = F === 0 ? z + 0.5 : z - 0.5;
		v = i[s] || i["default"];
		B = v(H, G, F);
		if (B == null) {
			B = (d.wallwise ? g["in"] : g.blank)
		}
		H.context.fillStyle = B;
		H.context.fillRect(D - 0.5, w - 0.5, C - D + 1, u - w + 1);
		H.context.beginPath();
		if (H.isWest(G, F) || H.isUnder(G, F)) {
			H.context.fillRect(E - 0.5, w - 0.5, D - E + 1, u - w + 1);
			l(H.context, E - 1, w, D, w);
			l(H.context, E - 1, u, D, u)
		}
		if (!H.isWest(G, F)) {
			l(H.context, D, w, D, u)
		}
		if (H.isEast(G, F) || H.isUnder(G, F)) {
			H.context.fillRect(C - 0.5, w - 0.5, A - C + 1, u - w + 1);
			l(H.context, C, w, A + 1, w);
			l(H.context, C, u, A + 1, u)
		}
		if (!H.isEast(G, F)) {
			l(H.context, C, w, C, u)
		}
		if (H.isNorth(G, F) || H.isUnder(G, F)) {
			H.context.fillRect(D - 0.5, z - 0.5, C - D + 1, w - z + 1);
			l(H.context, D, z - 1, D, w);
			l(H.context, C, z - 1, C, w)
		}
		if (!H.isNorth(G, F)) {
			l(H.context, D, w, C, w)
		}
		if (H.isSouth(G, F) || H.isUnder(G, F)) {
			H.context.fillRect(D - 0.5, u - 0.5, C - D + 1, I - u + 1);
			l(H.context, D, u, D, I + 1);
			l(H.context, C, u, C, I + 1)
		}
		if (!H.isSouth(G, F)) {
			l(H.context, D, u, C, u)
		}
		H.context.closePath();
		return H.context.stroke()
	};
	f = function(z) {
		var w, y, x, u, v;
		v = [];
		for (y = x = 0, u = z.height; x < u; y = x += 1) {
			v.push((function() {
				var B, C, A;
				A = [];
				for (w = B = 0, C = z.width; B < C; w = B += 1) {
					if (d.padded) {
						A.push(e(z, w, y))
					} else {
						A.push(c(z, w, y))
					}
				}
				return A
			})())
		}
		return v
	};
	t = function(w, u, v) {
		if (d.padded) {
			return e(w, u, v)
		} else {
			return c(w, u, v)
		}
	};
	n = function(w, u, v) {
		if (w.element.quickStep) {
			return w.element.mazePause()
		}
	};
	o = d.id || s.toLowerCase();
	if (d.interval == null) {
		d.interval = 50
	}
	p = "maze";
	if (d["class"]) {
		p += " " + d["class"]
	}
	r = "grid";
	if (d.wallwise) {
		r += " invert"
	}
	if (d.padded) {
		r += " padded"
	}
	if ((b = d.watch) != null ? b : true) {
		k = "<a id='" + o
				+ "_watch' href='#' onclick='document.getElementById(\"" + o
				+ "\").mazeQuickStep(); return false;'>Watch</a>"
	} else {
		k = ""
	}
	j = '<div id="' + o + '" class="' + p + '">\n  <canvas id="' + o
			+ '_canvas" width="210" height="210" class="' + r
			+ '"></canvas>\n  <div class="operations">\n    <a id="' + o
			+ '_reset" href="#" onclick="document.getElementById(\'' + o
			+ '\').mazeReset(); return false;">Reset</a>\n    <a id="' + o
			+ '_step" href="#" onclick="document.getElementById(\'' + o
			+ "').mazeStep(); return false;\">Step</a>\n    " + k
			+ '\n    <a id="' + o
			+ '_run" href="#" onclick="document.getElementById(\'' + o
			+ "').mazeRun(); return false;\">Run</a>\n  </div>\n</div>";
	document.write(j);
	a = document.getElementById(o);
	a.addClassName = function(x, v) {
		var w, z, y, u;
		z = x.className.split(" ");
		for (y = 0, u = z.length; y < u; y++) {
			w = z[y];
			if (w === v) {
				return
			}
		}
		return x.className += " " + v
	};
	a.removeClassName = function(y, w) {
		var x, A, z, v, u;
		if (y.className.length > 0) {
			A = y.className.split(" ");
			y.className = "";
			u = [];
			for (z = 0, v = A.length; z < v; z++) {
				x = A[z];
				if (x !== w) {
					if (y.className.length > 0) {
						y.className += " "
					}
					u.push(y.className += x)
				} else {
					u.push(void 0)
				}
			}
			return u
		}
	};
	a.mazePause = function() {
		if (this.mazeStepInterval != null) {
			clearInterval(this.mazeStepInterval);
			this.mazeStepInterval = null;
			this.quickStep = false;
			return true
		}
	};
	a.mazeRun = function() {
		if (!this.mazePause()) {
			return this.mazeStepInterval = setInterval(((function(u) {
				return function() {
					return u.mazeStep()
				}
			})(this)), d.interval)
		}
	};
	a.mazeStep = function() {
		var u;
		if (!this.maze.step()) {
			this.mazePause();
			this.addClassName(document.getElementById("" + this.id + "_step"),
					"disabled");
			if ((u = d.watch) != null ? u : true) {
				this.addClassName(document.getElementById("" + this.id
						+ "_watch"), "disabled")
			}
			return this.addClassName(document.getElementById("" + this.id
					+ "_run"), "disabled")
		}
	};
	a.mazeQuickStep = function() {
		this.quickStep = true;
		return this.mazeRun()
	};
	a.mazeReset = function() {
		var w, A, v, u, y, x, B, z;
		this.mazePause();
		if (typeof d.input === "function") {
			y = d.input()
		} else {
			y = d.input
		}
		if (typeof d.threshold === "function") {
			u = d.threshold()
		} else {
			u = d.threshold
		}
		A = Math.round(Math.sqrt(q * m));
		x = Math.round((q < m ? q : m) / 2);
		this.maze = new Maze(q, m, Maze.Algorithms[s], {
			seed : d.seed,
			rng : d.rng,
			input : y,
			weave : d.weave,
			weaveMode : d.weaveMode,
			weaveDensity : d.weaveDensity,
			threshold : u,
			growSpeed : A,
			wallSpeed : x
		});
		w = document.getElementById("" + this.id + "_canvas");
		this.maze.element = this;
		this.maze.canvas = w;
		this.maze.context = w.getContext("2d");
		this.maze.cellWidth = Math.floor(w.width / this.maze.width);
		this.maze.cellHeight = Math.floor(w.height / this.maze.height);
		if (d.padded) {
			v = (B = d.inset) != null ? B : 0.1;
			this.maze.insetWidth = Math.ceil(v * this.maze.cellWidth);
			this.maze.insetHeight = Math.ceil(v * this.maze.cellHeight)
		}
		this.maze.onUpdate(t);
		this.maze.onEvent(n);
		this.maze.context.clearRect(0, 0, w.width, w.height);
		this.removeClassName(document.getElementById("" + this.id + "_step"),
				"disabled");
		if ((z = d.watch) != null ? z : true) {
			this.removeClassName(document.getElementById("" + this.id
					+ "_watch"), "disabled")
		}
		this.removeClassName(document.getElementById("" + this.id + "_run"),
				"disabled");
		return f(this.maze)
	};
	return a.mazeReset()
};
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Eller = (function(a) {
	__extends(b, a);
	b.prototype.IN = 4096;
	b.prototype.HORIZONTAL = 0;
	b.prototype.VERTICAL = 1;
	function b(d, c) {
		b.__super__.constructor.apply(this, arguments);
		this.state = new Maze.Algorithms.Eller.State(this.maze.width)
				.populate();
		this.row = 0;
		this.pending = true;
		this.initializeRow()
	}
	b.prototype.initializeRow = function() {
		this.column = 0;
		return this.mode = this.HORIZONTAL
	};
	b.prototype.isFinal = function() {
		return this.row + 1 === this.maze.height
	};
	b.prototype.isIn = function(c, d) {
		return this.maze.isValid(c, d) && this.maze.isSet(c, d, this.IN)
	};
	b.prototype.isCurrent = function(c, d) {
		return this.column === c && this.row === d
	};
	b.prototype.horizontalStep = function() {
		var c, d;
		if (!this.state.isSame(this.column, this.column + 1)
				&& (this.isFinal() || this.rand.nextBoolean())) {
			this.state.merge(this.column, this.column + 1);
			this.maze.carve(this.column, this.row, Maze.Direction.E);
			this.updateAt(this.column, this.row);
			this.maze.carve(this.column + 1, this.row, Maze.Direction.W);
			this.updateAt(this.column + 1, this.row)
		} else {
			if (this.maze.isBlank(this.column, this.row)) {
				this.maze.carve(this.column, this.row, this.IN);
				this.updateAt(this.column, this.row)
			}
		}
		this.column += 1;
		if (this.column > 0) {
			this.updateAt(this.column - 1, this.row)
		}
		this.updateAt(this.column, this.row);
		if (this.column + 1 >= this.maze.width) {
			if (this.maze.isBlank(this.column, this.row)) {
				this.maze.carve(this.column, this.row, this.IN);
				this.updateAt(this.column, this.row)
			}
			if (this.isFinal()) {
				this.pending = false;
				d = [ this.column, null ], c = d[0], this.column = d[1];
				return this.updateAt(c, this.row)
			} else {
				this.mode = this.VERTICAL;
				this.next_state = this.state.next();
				this.verticals = this.computeVerticals();
				return this.eventAt(0, this.row)
			}
		}
	};
	b.prototype.computeVerticals = function() {
		var c;
		c = [];
		this.state.foreach((function(d) {
			return function(h, g) {
				var e, f;
				f = 1 + d.rand.nextInteger(g.length - 1);
				e = d.rand.randomizeList(g).slice(0, f);
				return c = c.concat(e)
			}
		})(this));
		return c.sort(function(e, d) {
			return e - d
		})
	};
	b.prototype.verticalStep = function() {
		var c, d;
		if (this.verticals.length === 0) {
			this.state = this.next_state.populate();
			this.row += 1;
			c = this.column;
			this.initializeRow();
			this.eventAt(0, this.row);
			this.updateAt(c, this.row - 1);
			return this.updateAt(this.column, this.row)
		} else {
			d = [ this.column, this.verticals.pop() ], c = d[0],
					this.column = d[1];
			this.updateAt(c, this.row);
			this.next_state.add(this.column, this.state.setFor(this.column));
			this.maze.carve(this.column, this.row, Maze.Direction.S);
			this.updateAt(this.column, this.row);
			this.maze.carve(this.column, this.row + 1, Maze.Direction.N);
			return this.updateAt(this.column, this.row + 1)
		}
	};
	b.prototype.step = function() {
		switch (this.mode) {
		case this.HORIZONTAL:
			this.horizontalStep();
			break;
		case this.VERTICAL:
			this.verticalStep()
		}
		return this.pending
	};
	return b
})(Maze.Algorithm);
Maze.Algorithms.Eller.State = (function() {
	function a(c, b) {
		this.width = c;
		this.counter = b;
		if (this.counter == null) {
			this.counter = 0
		}
		this.sets = {};
		this.cells = []
	}
	a.prototype.next = function() {
		return new Maze.Algorithms.Eller.State(this.width, this.counter)
	};
	a.prototype.populate = function() {
		var b, d, c;
		b = 0;
		while (b < this.width) {
			if (!this.cells[b]) {
				d = (this.counter += 1);
				((c = this.sets)[d] != null ? c[d] : c[d] = []).push(b);
				this.cells[b] = d
			}
			b += 1
		}
		return this
	};
	a.prototype.merge = function(h, i) {
		var b, g, d, f, c, e;
		g = this.cells[h];
		d = this.cells[i];
		this.sets[g] = this.sets[g].concat(this.sets[d]);
		e = this.sets[d];
		for (f = 0, c = e.length; f < c; f++) {
			b = e[f];
			this.cells[b] = g
		}
		return delete this.sets[d]
	};
	a.prototype.isSame = function(d, c) {
		return this.cells[d] === this.cells[c]
	};
	a.prototype.add = function(b, d) {
		var c;
		this.cells[b] = d;
		((c = this.sets)[d] != null ? c[d] : c[d] = []).push(b);
		return this
	};
	a.prototype.setFor = function(b) {
		return this.cells[b]
	};
	a.prototype.foreach = function(c) {
		var f, e, d, b;
		d = this.sets;
		b = [];
		for (f in d) {
			e = d[f];
			b.push(c(f, e))
		}
		return b
	};
	return a
})();
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.AldousBroder = (function(a) {
	__extends(b, a);
	b.prototype.IN = 4096;
	function b(d, c) {
		b.__super__.constructor.apply(this, arguments);
		this.state = 0;
		this.remaining = this.maze.width * this.maze.height
	}
	b.prototype.isCurrent = function(c, d) {
		return this.x === c && this.y === d
	};
	b.prototype.startStep = function() {
		this.x = this.rand.nextInteger(this.maze.width);
		this.y = this.rand.nextInteger(this.maze.height);
		this.maze.carve(this.x, this.y, this.IN);
		this.updateAt(this.x, this.y);
		this.remaining--;
		this.state = 1;
		return this.carvedOnLastStep = true
	};
	b.prototype.runStep = function() {
		var f, c, i, h, l, j, e, k, g, d;
		f = false;
		if (this.remaining > 0) {
			g = this.rand.randomDirections();
			for (e = 0, k = g.length; e < k; e++) {
				c = g[e];
				i = this.x + Maze.Direction.dx[c];
				h = this.y + Maze.Direction.dy[c];
				if (this.maze.isValid(i, h)) {
					d = [ this.x, this.y, i, h ], l = d[0], j = d[1],
							this.x = d[2], this.y = d[3];
					if (this.maze.isBlank(i, h)) {
						this.maze.carve(l, j, c);
						this.maze.carve(this.x, this.y,
								Maze.Direction.opposite[c]);
						this.remaining--;
						f = true;
						if (this.remaining === 0) {
							delete this.x;
							delete this.y
						}
					}
					this.updateAt(l, j);
					this.updateAt(i, h);
					break
				}
			}
		}
		if (f !== this.carvedOnLastStep) {
			this.eventAt(this.x, this.y)
		}
		this.carvedOnLastStep = f;
		return this.remaining > 0
	};
	b.prototype.step = function() {
		switch (this.state) {
		case 0:
			this.startStep();
			break;
		case 1:
			this.runStep()
		}
		return this.remaining > 0
	};
	return b
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.RecursiveBacktracker = (function(b) {
	__extends(a, b);
	a.prototype.IN = 4096;
	a.prototype.STACK = 8192;
	a.prototype.START = 1;
	a.prototype.RUN = 2;
	a.prototype.DONE = 3;
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.state = this.START;
		this.stack = []
	}
	a.prototype.step = function() {
		switch (this.state) {
		case this.START:
			this.startStep();
			break;
		case this.RUN:
			this.runStep()
		}
		return this.state !== this.DONE
	};
	a.prototype.startStep = function() {
		var c, e, d;
		d = [ this.rand.nextInteger(this.maze.width),
				this.rand.nextInteger(this.maze.height) ], c = d[0], e = d[1];
		this.maze.carve(c, e, this.IN | this.STACK);
		this.updateAt(c, e);
		this.stack.push({
			x : c,
			y : e,
			dirs : this.rand.randomDirections()
		});
		this.state = this.RUN;
		return this.carvedOnLastStep = true
	};
	a.prototype.runStep = function() {
		var e, d, c, f;
		while (true) {
			e = this.stack[this.stack.length - 1];
			d = e.dirs.pop();
			c = e.x + Maze.Direction.dx[d];
			f = e.y + Maze.Direction.dy[d];
			if (this.maze.isValid(c, f)) {
				if (this.maze.isBlank(c, f)) {
					this.stack.push({
						x : c,
						y : f,
						dirs : this.rand.randomDirections()
					});
					this.maze.carve(e.x, e.y, d);
					this.updateAt(e.x, e.y);
					this.maze.carve(c, f, Maze.Direction.opposite[d]
							| this.STACK);
					this.updateAt(c, f);
					if (!this.carvedOnLastStep) {
						this.eventAt(c, f)
					}
					this.carvedOnLastStep = true;
					break
				} else {
					if (this.canWeave(d, c, f)) {
						this.performWeave(d, e.x, e.y, (function(g) {
							return function(h, i) {
								g.stack.push({
									x : h,
									y : i,
									dirs : g.rand.randomDirections()
								});
								if (!g.carvedOnLastStep) {
									g.eventAt(h, i)
								}
								return g.maze.carve(h, i, g.STACK)
							}
						})(this));
						this.carvedOnLastStep = true;
						break
					}
				}
			}
			if (e.dirs.length === 0) {
				this.maze.uncarve(e.x, e.y, this.STACK);
				this.updateAt(e.x, e.y);
				if (this.carvedOnLastStep) {
					this.eventAt(e.x, e.y)
				}
				this.stack.pop();
				this.carvedOnLastStep = false;
				break
			}
		}
		if (this.stack.length === 0) {
			return this.state = this.DONE
		}
	};
	a.prototype.isStack = function(c, d) {
		return this.maze.isSet(c, d, this.STACK)
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.BinaryTree = (function(b) {
	__extends(a, b);
	a.prototype.IN = 4096;
	a.prototype.isCurrent = function(c, d) {
		return this.x === c && this.y === d
	};
	function a(e, c) {
		var d;
		a.__super__.constructor.apply(this, arguments);
		this.x = 0;
		this.y = 0;
		switch ((d = c.input) != null ? d : "nw") {
		case "nw":
			this.bias = Maze.Direction.N | Maze.Direction.W;
			break;
		case "ne":
			this.bias = Maze.Direction.N | Maze.Direction.E;
			break;
		case "sw":
			this.bias = Maze.Direction.S | Maze.Direction.W;
			break;
		case "se":
			this.bias = Maze.Direction.S | Maze.Direction.E
		}
		this.northBias = (this.bias & Maze.Direction.N) !== 0;
		this.southBias = (this.bias & Maze.Direction.S) !== 0;
		this.eastBias = (this.bias & Maze.Direction.E) !== 0;
		this.westBias = (this.bias & Maze.Direction.W) !== 0
	}
	a.prototype.step = function() {
		var h, g, c, i, e, d, f;
		if (this.y >= this.maze.height) {
			return false
		}
		g = [];
		if (this.northBias && this.y > 0) {
			g.push(Maze.Direction.N)
		}
		if (this.southBias && this.y + 1 < this.maze.height) {
			g.push(Maze.Direction.S)
		}
		if (this.westBias && this.x > 0) {
			g.push(Maze.Direction.W)
		}
		if (this.eastBias && this.x + 1 < this.maze.width) {
			g.push(Maze.Direction.E)
		}
		h = this.rand.randomElement(g);
		if (h) {
			c = this.x + Maze.Direction.dx[h];
			i = this.y + Maze.Direction.dy[h];
			this.maze.carve(this.x, this.y, h);
			this.maze.carve(c, i, Maze.Direction.opposite[h]);
			this.updateAt(c, i)
		} else {
			this.maze.carve(this.x, this.y, this.IN)
		}
		f = [ this.x, this.y ], e = f[0], d = f[1];
		this.x++;
		if (this.x >= this.maze.width) {
			this.x = 0;
			this.y++;
			this.eventAt(this.x, this.y)
		}
		this.updateAt(e, d);
		this.updateAt(this.x, this.y);
		return this.y < this.maze.height
	};
	return a
})(Maze.Algorithm);
var BlobbyCell, BlobbyRegion, __hasProp = {}.hasOwnProperty, __extends = function(
		d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
BlobbyCell = (function() {
	function a(c, b) {
		this.row = c;
		this.col = b;
		this.name = "r" + this.row + "c" + this.col
	}
	a.prototype.north = function() {
		return "r" + (this.row - 1) + "c" + this.col
	};
	a.prototype.south = function() {
		return "r" + (this.row + 1) + "c" + this.col
	};
	a.prototype.east = function() {
		return "r" + this.row + "c" + (this.col + 1)
	};
	a.prototype.west = function() {
		return "r" + this.row + "c" + (this.col - 1)
	};
	return a
})();
BlobbyRegion = (function() {
	function a() {
		this.cells = []
	}
	a.prototype.addCell = function(b) {
		this[b.name] = b;
		return this.cells.push(b)
	};
	return a
})();
Maze.Algorithms.BlobbyDivision = (function(b) {
	__extends(a, b);
	a.prototype.START = 1;
	a.prototype.PLANT = 2;
	a.prototype.GROW = 3;
	a.prototype.WALL = 4;
	function a(l, o) {
		var m, d, k, n, i, h, j, g, f, e, c;
		a.__super__.constructor.apply(this, arguments);
		this.threshold = (j = o.threshold) != null ? j : 4;
		this.growSpeed = (g = o.growSpeed) != null ? g : 5;
		this.wallSpeed = (f = o.wallSpeed) != null ? f : 2;
		this.stack = [];
		k = new BlobbyRegion;
		for (n = i = 0, e = l.height; 0 <= e ? i < e : i > e; n = 0 <= e ? ++i : --i) {
			for (d = h = 0, c = l.width; 0 <= c ? h < c : h > c; d = 0 <= c ? ++h : --h) {
				m = new BlobbyCell(n, d);
				k.addCell(m);
				if (n > 0) {
					l.carve(d, n, Maze.Direction.N);
					l.carve(d, n - 1, Maze.Direction.S)
				}
				if (d > 0) {
					l.carve(d, n, Maze.Direction.W);
					l.carve(d - 1, n, Maze.Direction.E)
				}
			}
		}
		this.stack.push(k);
		this.state = this.START
	}
	a.prototype.stateAt = function(f, h) {
		var d, e, g, c;
		e = "r" + h + "c" + f;
		d = (g = this.region) != null ? g[e] : void 0;
		if (d) {
			return (c = d.state) != null ? c : "active"
		} else {
			return "blank"
		}
	};
	a.prototype.step = function() {
		switch (this.state) {
		case this.START:
			return this.startRegion();
		case this.PLANT:
			return this.plantSeeds();
		case this.GROW:
			return this.growSeeds();
		case this.WALL:
			return this.drawWall()
		}
	};
	a.prototype.startRegion = function() {
		var c, f, d, e;
		delete this.boundary;
		this.region = this.stack.pop();
		if (this.region) {
			e = this.region.cells;
			for (f = 0, d = e.length; f < d; f++) {
				c = e[f];
				delete c.state
			}
			this.highlightRegion(this.region);
			this.state = this.PLANT;
			return true
		} else {
			return false
		}
	};
	a.prototype.plantSeeds = function() {
		var e, c, f, h, g, d;
		f = this.rand.randomizeList((function() {
			d = [];
			for (var j = 0, i = this.region.cells.length; 0 <= i ? j < i
					: j > i; 0 <= i ? j++ : j--) {
				d.push(j)
			}
			return d
		}).apply(this));
		this.subregions = {
			a : new BlobbyRegion,
			b : new BlobbyRegion
		};
		e = this.region.cells[f[0]];
		c = this.region.cells[f[1]];
		e.state = "a";
		c.state = "b";
		this.subregions.a.addCell(e);
		this.subregions.b.addCell(c);
		this.updateAt(e.col, e.row);
		this.updateAt(c.col, c.row);
		this.frontier = [ e, c ];
		this.state = this.GROW;
		return true
	};
	a.prototype.growSeeds = function() {
		var j, g, d, f, h, c, k, l, i;
		d = 0;
		while (this.frontier.length > 0 && d < this.growSpeed) {
			f = this.rand.nextInteger(this.frontier.length);
			j = this.frontier[f];
			c = this.region[j.north()];
			l = this.region[j.south()];
			g = this.region[j.east()];
			i = this.region[j.west()];
			h = [];
			if (c && !c.state) {
				h.push(c)
			}
			if (l && !l.state) {
				h.push(l)
			}
			if (g && !g.state) {
				h.push(g)
			}
			if (i && !i.state) {
				h.push(i)
			}
			if (h.length > 0) {
				k = this.rand.randomElement(h);
				k.state = j.state;
				this.subregions[j.state].addCell(k);
				this.frontier.push(k);
				this.updateAt(k.col, k.row);
				d += 1
			} else {
				this.frontier.splice(f, 1)
			}
		}
		this.state = this.frontier.length === 0 ? this.WALL : this.GROW;
		return true
	};
	a.prototype.findWall = function() {
		var c, j, k, g, f, i, d, h;
		this.boundary = [];
		h = this.subregions.a.cells;
		for (i = 0, d = h.length; i < d; i++) {
			c = h[i];
			k = this.region[c.north()];
			g = this.region[c.south()];
			j = this.region[c.east()];
			f = this.region[c.west()];
			if (k && k.state !== c.state) {
				this.boundary.push({
					from : c,
					to : k,
					dir : Maze.Direction.N
				})
			}
			if (g && g.state !== c.state) {
				this.boundary.push({
					from : c,
					to : g,
					dir : Maze.Direction.S
				})
			}
			if (j && j.state !== c.state) {
				this.boundary.push({
					from : c,
					to : j,
					dir : Maze.Direction.E
				})
			}
			if (f && f.state !== c.state) {
				this.boundary.push({
					from : c,
					to : f,
					dir : Maze.Direction.W
				})
			}
		}
		return this.rand.removeRandomElement(this.boundary)
	};
	a.prototype.drawWall = function() {
		var n, m, d, j, i, g, l, e, c, k, h, f;
		if (!this.boundary) {
			this.findWall()
		}
		d = 0;
		while (this.boundary.length > 0 && d < this.wallSpeed) {
			m = this.rand.removeRandomElement(this.boundary);
			this.maze.uncarve(m.from.col, m.from.row, m.dir);
			this.maze.uncarve(m.to.col, m.to.row,
					Maze.Direction.opposite[m.dir]);
			this.updateAt(m.from.col, m.from.row);
			d += 1
		}
		if (this.boundary.length === 0) {
			k = this.region.cells;
			for (j = 0, l = k.length; j < l; j++) {
				n = k[j];
				n.state = "blank"
			}
			if (this.subregions.a.cells.length >= this.threshold) {
				this.stack.push(this.subregions.a)
			} else {
				h = this.subregions.a.cells;
				for (i = 0, e = h.length; i < e; i++) {
					n = h[i];
					n.state = "in"
				}
			}
			if (this.subregions.b.cells.length >= this.threshold) {
				this.stack.push(this.subregions.b)
			} else {
				f = this.subregions.b.cells;
				for (g = 0, c = f.length; g < c; g++) {
					n = f[g];
					n.state = "in"
				}
			}
			this.highlightRegion(this.subregions.a);
			this.highlightRegion(this.subregions.b);
			this.state = this.START
		}
		return true
	};
	a.prototype.highlightRegion = function(h) {
		var c, g, e, f, d;
		f = h.cells;
		d = [];
		for (g = 0, e = f.length; g < e; g++) {
			c = f[g];
			d.push(this.updateAt(c.col, c.row))
		}
		return d
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.RecursiveDivision = (function(b) {
	__extends(a, b);
	a.prototype.CHOOSE_REGION = 0;
	a.prototype.MAKE_WALL = 1;
	a.prototype.MAKE_PASSAGE = 2;
	a.prototype.HORIZONTAL = 1;
	a.prototype.VERTICAL = 2;
	a.prototype.isCurrent = function(c, d) {
		return (this.region != null)
				&& (this.region.x <= c && c < this.region.x + this.region.width)
				&& (this.region.y <= d && d < this.region.y
						+ this.region.height)
	};
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.stack = [ {
			x : 0,
			y : 0,
			width : this.maze.width,
			height : this.maze.height
		} ];
		this.state = this.CHOOSE_REGION
	}
	a.prototype.chooseOrientation = function(d, c) {
		if (d < c) {
			return this.HORIZONTAL
		} else {
			if (c < d) {
				return this.VERTICAL
			} else {
				if (this.rand.nextBoolean()) {
					return this.HORIZONTAL
				} else {
					return this.VERTICAL
				}
			}
		}
	};
	a.prototype.updateRegion = function(g) {
		var c, h, f, e, d;
		d = [];
		for (h = f = 0, e = g.height; 0 <= e ? f < e : f > e; h = 0 <= e ? ++f
				: --f) {
			d
					.push((function() {
						var k, i, j;
						j = [];
						for (c = k = 0, i = g.width; 0 <= i ? k < i : k > i; c = 0 <= i ? ++k
								: --k) {
							j.push(this.updateAt(g.x + c, g.y + h))
						}
						return j
					}).call(this))
		}
		return d
	};
	a.prototype.step = function() {
		switch (this.state) {
		case this.CHOOSE_REGION:
			return this.chooseRegion();
		case this.MAKE_WALL:
			return this.makeWall();
		case this.MAKE_PASSAGE:
			return this.makePassage()
		}
	};
	a.prototype.chooseRegion = function() {
		var d, c;
		c = [ this.region, this.stack.pop() ], d = c[0], this.region = c[1];
		if (d) {
			this.updateRegion(d)
		}
		if (this.region) {
			this.updateRegion(this.region);
			this.state = this.MAKE_WALL;
			return true
		} else {
			return false
		}
	};
	a.prototype.makeWall = function() {
		var f, e, g, d, j, c, i, h;
		this.horizontal = this.chooseOrientation(this.region.width,
				this.region.height) === this.HORIZONTAL;
		this.wx = this.region.x
				+ (this.horizontal ? 0 : this.rand
						.nextInteger(this.region.width - 2));
		this.wy = this.region.y
				+ (this.horizontal ? this.rand
						.nextInteger(this.region.height - 2) : 0);
		f = this.horizontal ? 1 : 0;
		e = this.horizontal ? 0 : 1;
		g = this.horizontal ? this.region.width : this.region.height;
		this.dir = this.horizontal ? Maze.Direction.S : Maze.Direction.E;
		this.odir = Maze.Direction.opposite[this.dir];
		h = [ this.wx, this.wy ], c = h[0], i = h[1];
		while (g > 0) {
			this.maze.carve(c, i, this.dir);
			this.updateAt(c, i);
			d = c + Maze.Direction.dx[this.dir];
			j = i + Maze.Direction.dy[this.dir];
			this.maze.carve(d, j, this.odir);
			this.updateAt(d, j);
			c += f;
			i += e;
			g -= 1
		}
		this.state = this.MAKE_PASSAGE;
		return true
	};
	a.prototype.makePassage = function() {
		var e, d, j, g, f, h, c, i;
		g = this.wx
				+ (this.horizontal ? this.rand.nextInteger(this.region.width)
						: 0);
		f = this.wy
				+ (this.horizontal ? 0 : this.rand
						.nextInteger(this.region.height));
		this.maze.uncarve(g, f, this.dir);
		this.updateAt(g, f);
		d = g + Maze.Direction.dx[this.dir];
		j = f + Maze.Direction.dy[this.dir];
		this.maze.uncarve(d, j, this.odir);
		this.updateAt(d, j);
		h = this.horizontal ? this.region.width : this.wx - this.region.x + 1;
		e = this.horizontal ? this.wy - this.region.y + 1 : this.region.height;
		if (h >= 2 && e >= 2) {
			this.stack.push({
				x : this.region.x,
				y : this.region.y,
				width : h,
				height : e
			})
		}
		c = this.horizontal ? this.region.x : this.wx + 1;
		i = this.horizontal ? this.wy + 1 : this.region.y;
		h = this.horizontal ? this.region.width : this.region.x
				+ this.region.width - this.wx - 1;
		e = this.horizontal ? this.region.y + this.region.height - this.wy - 1
				: this.region.height;
		if (h >= 2 && e >= 2) {
			this.stack.push({
				x : c,
				y : i,
				width : h,
				height : e
			})
		}
		this.state = this.CHOOSE_REGION;
		return true
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Sidewinder = (function(b) {
	__extends(a, b);
	a.prototype.IN = 4096;
	a.prototype.isCurrent = function(c, d) {
		return this.x === c && this.y === d
	};
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.x = 0;
		this.y = 0;
		this.runStart = 0;
		this.state = 0
	}
	a.prototype.step = function() {
		var c, e, d, f;
		if (this.y >= this.maze.height) {
			return false
		}
		if (this.y > 0
				&& (this.x + 1 >= this.maze.width || this.rand.nextBoolean())) {
			c = this.runStart
					+ this.rand.nextInteger(this.x - this.runStart + 1);
			this.maze.carve(c, this.y, Maze.Direction.N);
			this.maze.carve(c, this.y - 1, Maze.Direction.S);
			this.updateAt(c, this.y);
			this.updateAt(c, this.y - 1);
			if (this.x - this.runStart > 0) {
				this.eventAt(this.x, this.y)
			}
			this.runStart = this.x + 1
		} else {
			if (this.x + 1 < this.maze.width) {
				this.maze.carve(this.x, this.y, Maze.Direction.E);
				this.maze.carve(this.x + 1, this.y, Maze.Direction.W);
				this.updateAt(this.x, this.y);
				this.updateAt(this.x + 1, this.y)
			} else {
				this.maze.carve(this.x, this.y, this.IN);
				this.updateAt(this.x, this.y)
			}
		}
		f = [ this.x, this.y ], e = f[0], d = f[1];
		this.x++;
		if (this.x >= this.maze.width) {
			this.x = 0;
			this.runStart = 0;
			this.y++
		}
		this.updateAt(e, d);
		this.updateAt(this.x, this.y);
		return this.y < this.maze.height
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.GrowingTree = (function(b) {
	__extends(a, b);
	a.prototype.QUEUE = 4096;
	function a(e, c) {
		var d;
		a.__super__.constructor.apply(this, arguments);
		this.cells = [];
		this.state = 0;
		this.script = new Maze.Algorithms.GrowingTree.Script(
				(d = c.input) != null ? d : "random", this.rand)
	}
	a.prototype.inQueue = function(c, d) {
		return this.maze.isSet(c, d, this.QUEUE)
	};
	a.prototype.enqueue = function(c, d) {
		this.maze.carve(c, d, this.QUEUE);
		return this.cells.push({
			x : c,
			y : d
		})
	};
	a.prototype.nextCell = function() {
		return this.script.nextIndex(this.cells.length)
	};
	a.prototype.startStep = function() {
		var c, e, d;
		d = [ this.rand.nextInteger(this.maze.width),
				this.rand.nextInteger(this.maze.height) ], c = d[0], e = d[1];
		this.enqueue(c, e);
		this.updateAt(c, e);
		return this.state = 1
	};
	a.prototype.runStep = function() {
		var d, i, f, c, j, h, e, g;
		f = this.nextCell();
		d = this.cells[f];
		g = this.rand.randomDirections();
		for (h = 0, e = g.length; h < e; h++) {
			i = g[h];
			c = d.x + Maze.Direction.dx[i];
			j = d.y + Maze.Direction.dy[i];
			if (this.maze.isValid(c, j)) {
				if (this.maze.isBlank(c, j)) {
					this.maze.carve(d.x, d.y, i);
					this.maze.carve(c, j, Maze.Direction.opposite[i]);
					this.enqueue(c, j);
					this.updateAt(d.x, d.y);
					this.updateAt(c, j);
					return
				} else {
					if (this.canWeave(i, c, j)) {
						this.performWeave(i, d.x, d.y, (function(k) {
							return function(m, l) {
								return k.enqueue(m, l)
							}
						})(this));
						return
					}
				}
			}
		}
		this.cells.splice(f, 1);
		this.maze.uncarve(d.x, d.y, this.QUEUE);
		return this.updateAt(d.x, d.y)
	};
	a.prototype.step = function() {
		switch (this.state) {
		case 0:
			this.startStep();
			break;
		case 1:
			this.runStep()
		}
		return this.cells.length > 0
	};
	return a
})(Maze.Algorithm);
Maze.Algorithms.GrowingTree.Script = (function() {
	function a(c, f) {
		var i, e, d, h, b, g;
		this.rand = f;
		this.commands = (function() {
			var m, k, l, j;
			l = c.split(/;|\r?\n/);
			j = [];
			for (m = 0, k = l.length; m < k; m++) {
				i = l[m];
				b = 0;
				h = (function() {
					var q, o, n, r, p;
					n = i.split(/,/);
					p = [];
					for (q = 0, o = n.length; q < o; q++) {
						d = n[q];
						r = d.split(/:/), e = r[0], g = r[1];
						b += parseInt(g != null ? g : 100);
						p.push({
							name : e.replace(/\s/, ""),
							weight : b
						})
					}
					return p
				})();
				j.push({
					total : b,
					parts : h
				})
			}
			return j
		})();
		this.current = 0
	}
	a.prototype.nextIndex = function(d) {
		var h, c, g, f, b, e;
		h = this.commands[this.current];
		this.current = (this.current + 1) % this.commands.length;
		g = this.rand.nextInteger(h.total);
		e = h.parts;
		for (f = 0, b = e.length; f < b; f++) {
			c = e[f];
			if (g < c.weight) {
				switch (c.name) {
				case "random":
					return this.rand.nextInteger(d);
				case "newest":
					return d - 1;
				case "middle":
					return Math.floor(d / 2);
				case "oldest":
					return 0;
				default:
					throw "invalid weight key `" + c.name + "'"
				}
			}
		}
	};
	return a
})();
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Houston = (function(b) {
	__extends(a, b);
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.options = c;
		this.threshold = 2 * this.maze.width * this.maze.height / 3
	}
	a.prototype.isCurrent = function(c, d) {
		return this.worker.isCurrent(c, d)
	};
	a.prototype.isVisited = function(c, d) {
		return this.worker.isVisited(c, d)
	};
	a.prototype.step = function() {
		var e, c, f, d;
		if (this.worker == null) {
			this.worker = new Maze.Algorithms.AldousBroder(this.maze,
					this.options);
			this.worker.onUpdate(this.updateCallback);
			this.worker.onEvent(this.eventCallback)
		}
		if (this.worker.remaining < this.threshold) {
			d = [ this.worker.x, this.worker.y ], c = d[0], f = d[1];
			delete this.worker.x;
			delete this.worker.y;
			this.updateAt(c, f);
			this.eventAt(c, f);
			e = new Maze.Algorithms.Wilson(this.maze, this.options);
			e.onUpdate(this.updateCallback);
			e.onEvent(this.eventCallback);
			e.state = 1;
			e.remaining = this.worker.remaining;
			this.worker = e;
			this.step = function() {
				return this.worker.step()
			}
		}
		return this.worker.step()
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.HuntAndKill = (function(b) {
	__extends(a, b);
	a.prototype.IN = 4096;
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.state = 0
	}
	a.prototype.isCurrent = function(c, e) {
		var d;
		return ((d = this.x) != null ? d : c) === c && this.y === e
	};
	a.prototype.isWalking = function() {
		return this.state === 1
	};
	a.prototype.isHunting = function() {
		return this.state === 2
	};
	a.prototype.callbackRow = function(g) {
		var c, f, e, d;
		d = [];
		for (c = f = 0, e = this.maze.width; 0 <= e ? f < e : f > e; c = 0 <= e ? ++f
				: --f) {
			d.push(this.updateAt(c, g))
		}
		return d
	};
	a.prototype.startStep = function() {
		this.x = this.rand.nextInteger(this.maze.width);
		this.y = this.rand.nextInteger(this.maze.height);
		this.maze.carve(this.x, this.y, this.IN);
		this.updateAt(this.x, this.y);
		return this.state = 1
	};
	a.prototype.walkStep = function() {
		var j, h, g, l, i, e, k, f, d, c;
		f = this.rand.randomDirections();
		for (e = 0, k = f.length; e < k; e++) {
			j = f[e];
			h = this.x + Maze.Direction.dx[j];
			g = this.y + Maze.Direction.dy[j];
			if (this.maze.isValid(h, g)) {
				if (this.maze.isBlank(h, g)) {
					d = [ this.x, this.y, h, g ], l = d[0], i = d[1],
							this.x = d[2], this.y = d[3];
					this.maze.carve(l, i, j);
					this.maze.carve(h, g, Maze.Direction.opposite[j]);
					this.updateAt(l, i);
					this.updateAt(h, g);
					return
				} else {
					if (this.canWeave(j, h, g)) {
						this.performWeave(j, this.x, this.y, (function(m) {
							return function(n, p) {
								var o;
								return o = [ m.x, m.y, n, p ], n = o[0],
										p = o[1], m.x = o[2], m.y = o[3], o
							}
						})(this));
						return
					}
				}
			}
		}
		c = [ this.x, this.y ], l = c[0], i = c[1];
		delete this.x;
		delete this.y;
		this.updateAt(l, i);
		this.eventAt(l, i);
		this.y = 0;
		this.state = 2;
		return this.callbackRow(0)
	};
	a.prototype.huntStep = function() {
		var h, e, d, i, c, g, f;
		for (c = g = 0, f = this.maze.width; 0 <= f ? g < f : g > f; c = 0 <= f ? ++g
				: --g) {
			if (this.maze.isBlank(c, this.y)) {
				e = [];
				if (this.y > 0 && !this.maze.isBlank(c, this.y - 1)) {
					e.push(Maze.Direction.N)
				}
				if (c > 0 && !this.maze.isBlank(c - 1, this.y)) {
					e.push(Maze.Direction.W)
				}
				if (this.y + 1 < this.maze.height
						&& !this.maze.isBlank(c, this.y + 1)) {
					e.push(Maze.Direction.S)
				}
				if (c + 1 < this.maze.width
						&& !this.maze.isBlank(c + 1, this.y)) {
					e.push(Maze.Direction.E)
				}
				h = this.rand.randomElement(e);
				if (h) {
					this.x = c;
					d = this.x + Maze.Direction.dx[h];
					i = this.y + Maze.Direction.dy[h];
					this.maze.carve(this.x, this.y, h);
					this.maze.carve(d, i, Maze.Direction.opposite[h]);
					this.state = 1;
					this.updateAt(d, i);
					this.callbackRow(this.y);
					this.eventAt(d, i);
					return
				}
			}
		}
		this.y++;
		this.callbackRow(this.y - 1);
		if (this.y >= this.maze.height) {
			this.state = 3;
			delete this.x;
			return delete this.y
		} else {
			return this.callbackRow(this.y)
		}
	};
	a.prototype.step = function() {
		switch (this.state) {
		case 0:
			this.startStep();
			break;
		case 1:
			this.walkStep();
			break;
		case 2:
			this.huntStep()
		}
		return this.state !== 3
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Kruskal = (function(b) {
	__extends(a, b);
	a.prototype.WEAVE = 1;
	a.prototype.JOIN = 2;
	function a(k, l) {
		var j, i, g, e, h, f, d, c;
		a.__super__.constructor.apply(this, arguments);
		this.sets = [];
		this.edges = [];
		for (i = g = 0, h = this.maze.height; 0 <= h ? g < h : g > h; i = 0 <= h ? ++g
				: --g) {
			this.sets.push([]);
			for (j = e = 0, f = this.maze.width; 0 <= f ? e < f : e > f; j = 0 <= f ? ++e
					: --e) {
				this.sets[i].push(new Maze.Algorithms.Kruskal.Tree());
				if (i > 0) {
					this.edges.push({
						x : j,
						y : i,
						direction : Maze.Direction.N
					})
				}
				if (j > 0) {
					this.edges.push({
						x : j,
						y : i,
						direction : Maze.Direction.W
					})
				}
			}
		}
		this.rand.randomizeList(this.edges);
		this.weaveMode = (d = l.weaveMode) != null ? d : "onePhase";
		if (typeof this.weaveMode === "function") {
			this.weaveMode = this.weaveMode()
		}
		this.weaveDensity = (c = l.weaveDensity) != null ? c : 80;
		if (typeof this.weaveDensity === "function") {
			this.weaveDensity = this.weaveDensity()
		}
		this.state = (this.maze.isWeave != null)
				&& this.weaveMode === "twoPhase" ? this.WEAVE : this.JOIN
	}
	a.prototype.connect = function(d, f, c, e, g) {
		this.sets[f][d].connect(this.sets[e][c]);
		this.maze.carve(d, f, g);
		this.updateAt(d, f);
		this.maze.carve(c, e, Maze.Direction.opposite[g]);
		return this.updateAt(c, e)
	};
	a.prototype.weaveStep = function() {
		var i, o, n, s, q, p, j, m, l, u, t, e, r, k, h, g, f, c, d;
		if (this.x == null) {
			this.y = 1;
			this.x = 1
		}
		d = [];
		while (this.state === this.WEAVE) {
			if (this.maze.isBlank(this.x, this.y)
					&& this.rand.nextInteger(100) < this.weaveDensity) {
				k = [ this.x, this.y - 1 ], q = k[0], p = k[1];
				h = [ this.x - 1, this.y ], u = h[0], t = h[1];
				g = [ this.x + 1, this.y ], o = g[0], n = g[1];
				f = [ this.x, this.y + 1 ], m = f[0], l = f[1];
				j = !this.sets[p][q].isConnectedTo(this.sets[l][m])
						&& !this.sets[t][u].isConnectedTo(this.sets[n][o]);
				if (j) {
					this.sets[p][q].connect(this.sets[l][m]);
					this.sets[t][u].connect(this.sets[n][o]);
					if (this.rand.nextBoolean()) {
						this.maze.carve(this.x, this.y, Maze.Direction.E
								| Maze.Direction.W | Maze.Direction.U)
					} else {
						this.maze.carve(this.x, this.y, Maze.Direction.N
								| Maze.Direction.S | Maze.Direction.U)
					}
					this.maze.carve(q, p, Maze.Direction.S);
					this.maze.carve(u, t, Maze.Direction.E);
					this.maze.carve(o, n, Maze.Direction.W);
					this.maze.carve(m, l, Maze.Direction.N);
					this.updateAt(this.x, this.y);
					this.updateAt(q, p);
					this.updateAt(u, t);
					this.updateAt(o, n);
					this.updateAt(m, l);
					s = [];
					c = this.edges;
					for (e = 0, r = c.length; e < r; e++) {
						i = c[e];
						if ((i.x === this.x && i.y === this.y)
								|| (i.x === o && i.y === n && i.direction === Maze.Direction.W)
								|| (i.x === m && i.y === l && i.direction === Maze.Direction.N)) {
							continue
						}
						s.push(i)
					}
					this.edges = s;
					break
				}
			}
			this.x++;
			if (this.x >= this.maze.width - 1) {
				this.x = 1;
				this.y++;
				if (this.y >= this.maze.height - 1) {
					this.state = this.JOIN;
					d.push(this.eventAt(this.x, this.y))
				} else {
					d.push(void 0)
				}
			} else {
				d.push(void 0)
			}
		}
		return d
	};
	a.prototype.joinStep = function() {
		var c, d, m, l, o, j, n, k, i, g, f, h, e;
		e = [];
		while (this.edges.length > 0) {
			c = this.edges.pop();
			l = c.x + Maze.Direction.dx[c.direction];
			j = c.y + Maze.Direction.dy[c.direction];
			k = this.sets[c.y][c.x];
			i = this.sets[j][l];
			if ((this.maze.isWeave != null) && this.weaveMode === "onePhase"
					&& this.maze.isPerpendicular(l, j, c.direction)) {
				o = l + Maze.Direction.dx[c.direction];
				n = j + Maze.Direction.dy[c.direction];
				g = null;
				for (m = f = 0, h = this.edges.length; 0 <= h ? f < h : f > h; m = 0 <= h ? ++f
						: --f) {
					d = this.edges[m];
					if (d.x === l && d.y === j && d.direction === c.direction) {
						this.edges.splice(m, 1);
						g = this.sets[n][o];
						break
					}
				}
				if (g && !k.isConnectedTo(g)) {
					this.connect(c.x, c.y, o, n, c.direction);
					this.performThruWeave(l, j);
					this.updateAt(l, j);
					break
				} else {
					if (!k.isConnectedTo(i)) {
						this.connect(c.x, c.y, l, j, c.direction);
						break
					} else {
						e.push(void 0)
					}
				}
			} else {
				if (!k.isConnectedTo(i)) {
					this.connect(c.x, c.y, l, j, c.direction);
					break
				} else {
					e.push(void 0)
				}
			}
		}
		return e
	};
	a.prototype.step = function() {
		switch (this.state) {
		case this.WEAVE:
			this.weaveStep();
			break;
		case this.JOIN:
			this.joinStep()
		}
		return this.edges.length > 0
	};
	return a
})(Maze.Algorithm);
Maze.Algorithms.Kruskal.Tree = (function() {
	function a() {
		this.up = null
	}
	a.prototype.root = function() {
		if (this.up) {
			return this.up.root()
		} else {
			return this
		}
	};
	a.prototype.isConnectedTo = function(b) {
		return this.root() === b.root()
	};
	a.prototype.connect = function(b) {
		return b.root().up = this
	};
	return a
})();
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Prim = (function(a) {
	__extends(b, a);
	b.prototype.IN = 4096;
	b.prototype.FRONTIER = 8192;
	b.prototype.START = 1;
	b.prototype.EXPAND = 2;
	b.prototype.DONE = 3;
	function b(d, c) {
		b.__super__.constructor.apply(this, arguments);
		this.frontierCells = [];
		this.state = this.START
	}
	b.prototype.isOutside = function(c, d) {
		return this.maze.isValid(c, d) && this.maze.isBlank(c, d)
	};
	b.prototype.isInside = function(c, d) {
		return this.maze.isValid(c, d) && this.maze.isSet(c, d, this.IN)
	};
	b.prototype.isFrontier = function(c, d) {
		return this.maze.isValid(c, d) && this.maze.isSet(c, d, this.FRONTIER)
	};
	b.prototype.addFrontier = function(c, d) {
		if (this.isOutside(c, d)) {
			this.frontierCells.push({
				x : c,
				y : d
			});
			this.maze.carve(c, d, this.FRONTIER);
			return this.updateAt(c, d)
		}
	};
	b.prototype.markCell = function(c, d) {
		this.maze.carve(c, d, this.IN);
		this.maze.uncarve(c, d, this.FRONTIER);
		this.updateAt(c, d);
		this.addFrontier(c - 1, d);
		this.addFrontier(c + 1, d);
		this.addFrontier(c, d - 1);
		return this.addFrontier(c, d + 1)
	};
	b.prototype.findNeighborsOf = function(c, e) {
		var d;
		d = [];
		if (this.isInside(c - 1, e)) {
			d.push(Maze.Direction.W)
		}
		if (this.isInside(c + 1, e)) {
			d.push(Maze.Direction.E)
		}
		if (this.isInside(c, e - 1)) {
			d.push(Maze.Direction.N)
		}
		if (this.isInside(c, e + 1)) {
			d.push(Maze.Direction.S)
		}
		return d
	};
	b.prototype.startStep = function() {
		this.markCell(this.rand.nextInteger(this.maze.width), this.rand
				.nextInteger(this.maze.height));
		return this.state = this.EXPAND
	};
	b.prototype.expandStep = function() {
		var d, h, c, e, i, f, g;
		d = this.rand.removeRandomElement(this.frontierCells);
		h = this.rand.randomElement(this.findNeighborsOf(d.x, d.y));
		c = d.x + Maze.Direction.dx[h];
		i = d.y + Maze.Direction.dy[h];
		if (this.maze.isWeave && this.maze.isPerpendicular(c, i, h)) {
			e = c + Maze.Direction.dx[h];
			f = i + Maze.Direction.dy[h];
			if (this.isInside(e, f)) {
				this.performThruWeave(c, i);
				this.updateAt(c, i);
				g = [ e, f ], c = g[0], i = g[1]
			}
		}
		this.maze.carve(c, i, Maze.Direction.opposite[h]);
		this.updateAt(c, i);
		this.maze.carve(d.x, d.y, h);
		this.markCell(d.x, d.y);
		if (this.frontierCells.length === 0) {
			return this.state = this.DONE
		}
	};
	b.prototype.step = function() {
		switch (this.state) {
		case this.START:
			this.startStep();
			break;
		case this.EXPAND:
			this.expandStep()
		}
		return this.state !== this.DONE
	};
	return b
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.Wilson = (function(b) {
	__extends(a, b);
	a.prototype.IN = 4096;
	function a(d, c) {
		a.__super__.constructor.apply(this, arguments);
		this.state = 0;
		this.remaining = this.maze.width * this.maze.height;
		this.visits = {}
	}
	a.prototype.isCurrent = function(c, d) {
		return this.x === c && this.y === d
	};
	a.prototype.isVisited = function(c, d) {
		return this.visits["" + c + ":" + d] != null
	};
	a.prototype.addVisit = function(c, e, d) {
		return this.visits["" + c + ":" + e] = d != null ? d : 0
	};
	a.prototype.exitTaken = function(c, d) {
		return this.visits["" + c + ":" + d]
	};
	a.prototype.startStep = function() {
		var c, d;
		c = this.rand.nextInteger(this.maze.width);
		d = this.rand.nextInteger(this.maze.height);
		this.maze.carve(c, d, this.IN);
		this.updateAt(c, d);
		this.remaining--;
		return this.state = 1
	};
	a.prototype.startWalkStep = function() {
		var c;
		this.visits = {};
		c = [];
		while (true) {
			this.x = this.rand.nextInteger(this.maze.width);
			this.y = this.rand.nextInteger(this.maze.height);
			if (this.maze.isBlank(this.x, this.y)) {
				this.eventAt(this.x, this.y);
				this.state = 2;
				this.start = {
					x : this.x,
					y : this.y
				};
				this.addVisit(this.x, this.y);
				this.updateAt(this.x, this.y);
				break
			} else {
				c.push(void 0)
			}
		}
		return c
	};
	a.prototype.walkStep = function() {
		var j, h, g, l, i, e, k, f, d, c;
		f = this.rand.randomDirections();
		c = [];
		for (e = 0, k = f.length; e < k; e++) {
			j = f[e];
			h = this.x + Maze.Direction.dx[j];
			g = this.y + Maze.Direction.dy[j];
			if (this.maze.isValid(h, g)) {
				d = [ this.x, this.y, h, g ], l = d[0], i = d[1],
						this.x = d[2], this.y = d[3];
				this.addVisit(l, i, j);
				this.updateAt(l, i);
				this.updateAt(h, g);
				if (!this.maze.isBlank(h, g)) {
					this.x = this.start.x;
					this.y = this.start.y;
					this.state = 3;
					this.eventAt(this.x, this.y)
				}
				break
			} else {
				c.push(void 0)
			}
		}
		return c
	};
	a.prototype.resetVisits = function() {
		var f, g, d, i, h, c, e;
		h = this.visits;
		e = [];
		for (g in h) {
			f = h[g];
			c = g.split(":"), d = c[0], i = c[1];
			delete this.visits[g];
			e.push(this.updateAt(d, i))
		}
		return e
	};
	a.prototype.runStep = function() {
		var e, d, h, c, g, f;
		if (this.remaining > 0) {
			e = this.exitTaken(this.x, this.y);
			d = this.x + Maze.Direction.dx[e];
			h = this.y + Maze.Direction.dy[e];
			if (!this.maze.isBlank(d, h)) {
				this.resetVisits();
				this.state = 1
			}
			this.maze.carve(this.x, this.y, e);
			this.maze.carve(d, h, Maze.Direction.opposite[e]);
			f = [ this.x, this.y, d, h ], c = f[0], g = f[1], this.x = f[2],
					this.y = f[3];
			if (this.state === 1) {
				delete this.x;
				delete this.y
			}
			this.updateAt(c, g);
			this.updateAt(d, h);
			this.remaining--
		}
		return this.remaining > 0
	};
	a.prototype.step = function() {
		if (this.remaining > 0) {
			switch (this.state) {
			case 0:
				this.startStep();
				break;
			case 1:
				this.startWalkStep();
				break;
			case 2:
				this.walkStep();
				break;
			case 3:
				this.runStep()
			}
		}
		return this.remaining > 0
	};
	return a
})(Maze.Algorithm);
var __hasProp = {}.hasOwnProperty, __extends = function(d, b) {
	for ( var a in b) {
		if (__hasProp.call(b, a)) {
			d[a] = b[a]
		}
	}
	function c() {
		this.constructor = d
	}
	c.prototype = b.prototype;
	d.prototype = new c();
	d.__super__ = b.prototype;
	return d
};
Maze.Algorithms.GrowingBinaryTree = (function(a) {
	__extends(b, a);
	function b() {
		return b.__super__.constructor.apply(this, arguments)
	}
	b.prototype.runStep = function() {
		var k, g, i, h, f, e, c, j, d;
		h = this.nextCell();
		k = this.cells.splice(h, 1)[0];
		this.maze.uncarve(k.x, k.y, this.QUEUE);
		this.updateAt(k.x, k.y);
		g = 0;
		d = this.rand.randomDirections();
		for (c = 0, j = d.length; c < j; c++) {
			i = d[c];
			f = k.x + Maze.Direction.dx[i];
			e = k.y + Maze.Direction.dy[i];
			if (this.maze.isValid(f, e) && this.maze.isBlank(f, e)) {
				this.maze.carve(k.x, k.y, i);
				this.maze.carve(f, e, Maze.Direction.opposite[i]);
				this.enqueue(f, e);
				this.updateAt(k.x, k.y);
				this.updateAt(f, e);
				g += 1;
				if (g > 1) {
					return
				}
			}
		}
	};
	return b
})(Maze.Algorithms.GrowingTree);
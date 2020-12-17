import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.less']
})
export class NodeComponent implements OnInit, OnChanges {
  @Input() mix = 0;
  @Input() flag = false;
  mixColor: string | undefined = '#000000';
  red = '#f5222d';
  blue = '#1890ff';

  toRGBA = (d: string) => {
    const l = d.length;
    const rgba = [];
    const hex = parseInt(d.slice(1), 16);
    rgba[0] = (hex >> 16) & 255;
    rgba[1] = (hex >> 8) & 255;
    rgba[2] = hex & 255;
    rgba[3] = l === 9 || l === 5 ? Math.round((((hex >> 24) & 255) / 255) * 10000) / 10000 : -1;
    return rgba;
  };

  blend = (from: string, to: string, p = 0.5) => {
    from = from.trim();
    to = to.trim();
    const b = p < 0;
    p = b ? p * -1 : p;
    const f = this.toRGBA(from);
    const t = this.toRGBA(to);
    if (to[0] === 'r') {
      return 'rgb' + (to[3] === 'a' ? 'a(' : '(') +
        Math.round(((t[0] - f[0]) * p) + f[0]) + ',' +
        Math.round(((t[1] - f[1]) * p) + f[1]) + ',' +
        Math.round(((t[2] - f[2]) * p) + f[2]) + (
          f[3] < 0 && t[3] < 0 ? '' : ',' + (
            f[3] > -1 && t[3] > -1
              ? Math.round((((t[3] - f[3]) * p) + f[3]) * 10000) / 10000
              : t[3] < 0 ? f[3] : t[3]
          )
        ) + ')';
    }

    return '#' + (0x100000000 + ((
        f[3] > -1 && t[3] > -1
          ? Math.round((((t[3] - f[3]) * p) + f[3]) * 255)
          : t[3] > -1 ? Math.round(t[3] * 255) : f[3] > -1 ? Math.round(f[3] * 255) : 255
      ) * 0x1000000) +
      (Math.round(((t[0] - f[0]) * p) + f[0]) * 0x10000) +
      (Math.round(((t[1] - f[1]) * p) + f[1]) * 0x100) +
      Math.round(((t[2] - f[2]) * p) + f[2])
    ).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
  };


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mix) {
      this.mixColor = this.blend(this.blue, this.red, this.mix);
    }
  }

}

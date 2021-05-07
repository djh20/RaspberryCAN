module.exports = {
  id: 'nissan-leaf-2011-ze0',
  name: 'Nissan Leaf 2011 (ZE0)',
  getInfo: (metrics) => {
    let info = {};

    let speed = metrics.get('rear_speed');
    info.moving = speed && speed.value > 0 ? true: false;

    return info;
  },
  can: [
    {
      id: 0x11a,
      name: 'Shift Controller',
      points: [
        {
          id: 4,
          name: 'gear',
          process: (buf) => (buf[0] & 0xF0) >> 4,
        },
        {
          id: 0,
          name: 'powered',
          process: (buf) => (buf[1] & 0x40) >> 6,
        },
        {
          id: 5,
          name: 'eco',
          process: (buf) => (buf[1] & 0x10) >> 4,
        }
      ]
    },
    {
      id: 0x5bc,
      name: 'Lithium Battery Controller (500ms)',
      points: [
        {
          id: 7,
          name: 'soc_gids',
          process: (buf) => (buf[0] << 2) | (buf[1] >> 6)
        },
        {
          name: 'soh',
          suffix: '%',
          process: (buf) => (buf[4] & 0xFE) >> 1 
        }
      ]
    },
    {
      id: 0x1db,
      name: 'Lithium Battery Controller (10ms)',
      points: [
        {
          id: 8,
          name: 'battery_power',
          log: false,
          interval: 50,
          suffix: ' kW',
          process: (buf) => {
            let voltage = ((buf[2] << 2) | (buf[3] >> 6)) / 2.0;
            let current = ((buf[0] << 3) | (buf[1] & 0xe0) >> 5);
            
            // 0x0400 = 10000000000 (11 bits)
            // 0x7FF  = 11111111111 (11 bits)

            // 1 -> check if byte is negative by checking sign bit
            // 2 -> invert the byte and apply a mask for the first 11 bits (js numbers are 32-bit)
            // 3 -> minus 1 for 2's complement
            
            if (current & 0x0400) current = -(~current & 0x7FF)-1
            current = -current / 2.0;
            
            let power = (current * voltage)/1000.0;
            
            return power;
          },
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x55b,
      name: 'Lithium Battery Controller (10ms)',
      points: [
        {
          id: 6,
          name: 'soc_percent',
          suffix: '%',
          process: (buf) => ((buf[0] << 2) | (buf[1] >> 6)) / 10.0,
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x1d4,
      name: 'Vehicle Control Module (10ms)',
      points: [
        {
          id: 9,
          name: 'charging',
          process: (buf) => {
            let val = (buf[6] & 0xE0);
            return val == 192 || val == 224 ? 1 : 0
          }
        }
      ]
    },
    {
      id: 0x284,
      name: 'ABS Module',
      points: [
        {
          id: 2,
          name: 'left_speed',
          log: false,
          interval: 100,
          process: (buf) => ((buf[2] << 8) | buf[3]) / 10,
          convert: (value) => new Uint16Array([value])
        },
        {
          id: 3,
          name: 'right_speed',
          log: false,
          interval: 100,
          process: (buf) => ((buf[0] << 8) | buf[1]) / 10,
          convert: (value) => new Uint16Array([value])
        },
        {
          id: 1,
          log: false,
          name: 'rear_speed',
          suffix: ' km/h',
          interval: 80,
          process: (buf) => ((buf[4] << 8) | buf[5]) / 100
        },
      ]
    },
    {
      id: 0x55a,
      name: 'Inverter (100ms)',
      points: [
        {
          id: 12,
          name: 'motor_temp',
          suffix: '°C',
          process: (buf) => 5.0 / 9.0 * (buf[1] - 32),
          convert: (value) => new Uint16Array([value*100])
        },
        {
          id: 11,
          name: 'inverter_temp',
          suffix: '°C',
          process: (buf) => 5.0 / 9.0 * (buf[2] - 32),
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x54c,
      name: 'Climate',
      points: [
        {
          name: 'ambient_temp',
          suffix: '°C',
          process: (buf) => {
            // if the byte is 11111111, then the temperature is invalid.
            if (buf[6] == 0xff) return null;
            return (buf[6]) / 2.0 - 40;
          },
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x54b,
      name: 'Climate',
      points: [
        {
          id: 10,
          name: 'climate_fan_speed',
          process: (buf) => (buf[4] & 0xF0) / 8
        }
      ]
    }
  ]
}
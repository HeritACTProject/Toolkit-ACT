let distanceFromGoal = {};

const numberOfTargetsPerGoal = {
  1: 7,
  2: 8,
  3: 13,
  4: 10,
  5: 9,
  6: 8,
  7: 5,
  8: 12,
  9: 8,
  10: 10,
  11: 10,
  12: 11,
  13: 5,
  14: 10,
  15: 12,
  16: 12,
  17: 19,
};

const sdgTitles = [
  'No Poverty',
  'Zero Hunger',
  'Good Health and Wellbeing',
  'Quality Education',
  'Gender Equality',
  'Clean Water and Sanitation',
  'Affordable and Clean Energy',
  'Decent Work and Economic Growth',
  'Industry, Innovation and Infrastructure',
  'Reduced Inequalities',
  'Sustainable Cities and Communities',
  'Responsible Consumption and Production',
  'Climate Action',
  'Life Below Water',
  'Life on Land',
  'Peace, Justice and Strong Institutions',
  'Partnership for the Goals',
];

const sdgColors = [
  'hsl(205, 62%, 26%)',
  'hsl(353, 79%, 52%)',
  'hsl(40, 71%, 55%)',
  'hsl(108, 48%, 42%)',
  'hsl(353, 77%, 44%)',
  'hsl(7, 100%, 56%)',
  'hsl(192, 76%, 52%)',
  'hsl(46, 98%, 52%)',
  'hsl(342, 73%, 37%)',
  'hsl(19, 98%, 57%)',
  'hsl(335, 84%, 47%)',
  'hsl(33, 98%, 57%)',
  'hsl(38, 61%, 46%)',
  'hsl(125, 33%, 37%)',
  'hsl(199, 91%, 45%)',
  'hsl(103, 63%, 46%)',
  'hsl(200, 100%, 31%)',
];

function createPartition(radius) {
  return d3.partition()
    .size([2 * Math.PI, radius]);
}

function createRoot() {
  return d3.stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent)(JSON.parse(d3.selectAll('svg').attr('data-node')))
    .sum((d) => d.size);
}

function getTargetHeight(goal) {
  const maxTargets = 19;
  return maxTargets / numberOfTargetsPerGoal[goal];
}

function getGoalArc() {
  return d3.arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0 * 4)
    .outerRadius((d) => d.y1 * 3.5);
}

function getTargetArc(goal, width, height) {
  return d3.arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => {
      if (!d.data.parent.includes('.')) {
        distanceFromGoal[goal] = d.y0 * getTargetHeight(goal);
      }
      return (d.y0 * getTargetHeight(goal))
    - distanceFromGoal[goal] + (70 * (Math.min(width, height) / 500));
    })
    .outerRadius((d) => d.y1 * getTargetHeight(goal)
    - distanceFromGoal[goal] + (70 * (Math.min(width, height) / 500)));
}

function computeRotation(d) {
  const angle = (d.x0 + d.x1) / Math.PI * 90;
  return (angle < 90 || angle > 270) ? angle : angle + 180;
}

function getSize() {
  let size = window.screen.availHeight * 0.9;
  if (window.innerWidth < size * 1.2) {
    size = window.innerWidth * 0.8;
  }
  return size;
}

function createSDGWheel() {
  // Variables
  const height = getSize();
  const width = getSize();
  d3.selectAll('svg').attr('height', height);
  d3.selectAll('svg').attr('width', width);
  const radius = getSize() / 2.5;

  const color = d3.scaleOrdinal(sdgColors);

  // Create primary <g> element
  const g = d3.selectAll('svg')
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  // Data strucure
  const partition = createPartition(radius);

  // Find data root
  const root = createRoot();
  partition(root);

  distanceFromGoal = {};

  // Path
  g.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', (d) => {
      if (d.data.selected) {
        return 'selectedTarget';
      }
      if (d.depth === 1) {
        return 'goal';
      }
    })
    .append('path')
    .attr('display', (d) => (d.depth ? null : 'none'))
    .attr('d', (d) => {
      if (!d.data.name.includes('.')) {
        return getGoalArc()(d);
      }
      const goal = parseInt(d.data.name.substr(0, d.data.name.indexOf('.')), 10);
      return getTargetArc(goal, width, height)(d);
    })
    .style('stroke', d3.select('body').style('background-color'))
    .style('fill', (d) => {
      if (d.data.name.includes('.')) {
        return color(d.data.name.substr(0, d.data.name.indexOf('.')));
      }
      return color(parseInt(d.data.name, 10));
    })
    .attr('fill-opacity', (d) => {
      if (!d.depth) return 0;
      if (d.depth > 1) {
        if (d.data.selected) {
          return 0.7;
        }
        return 0.05;
      }
      return 0.9;
    });

  // Text
  g.selectAll('.selectedTarget')
    .append('text')
    .text((d) => d.data.name)
    .attr('data-goal', (d) => d.data.name.substr(0, d.data.name.indexOf('.')))
    .attr('text-anchor', 'middle')
    .attr('dy', '.4em')
    .attr('font-family', 'Poppins, sans-serif')
    .attr('pointer-events', 'none')
    .attr('data-toggle', 'tooltip')
    .attr('data-html', 'true')
    .attr('data-original-title', (d) => `<strong> Target ${d.data.name} </strong> <br> ${d.data.title}`);

  $('.selectedTarget').hover(
    function(e) {
      $(this).children('text').tooltip('toggle');
      $(this).children('path').css('fill-opacity', 1);
    }, function(e) {
      $(this).children('text').tooltip('dispose');
      $(this).children('path').css('fill-opacity', 0.7);
    },
  );

  // Image
  const goals = g.selectAll('.goal');

  // tooltip needs to be attcheched to text for firefox
  goals
    .append('text')
    .text((d) => d.data.name)
    .attr('data-goal', (d) => d.data.name)
    .attr('fill', (d) => color(d.data.name))
    .attr('text-anchor', 'middle')
    .attr('dy', '.4em')
    .attr('font-family', 'Poppins, sans-serif')
    .attr('pointer-events', 'none')
    .attr('data-toggle', 'tooltip')
    .attr('data-html', 'true')
    .attr('data-original-title', (d) => `<strong> Goal ${d.data.name} </strong> <br> ${sdgTitles[parseInt(d.data.name, 10) - 1]}`);

  goals
    .append('svg')
    .style('overflow', 'visible')
    .attr('data-html', 'true')
    .append('image')
    .attr('xlink:href', (d) => d.data.image)
    .attr('opacity', 1)
    .attr('transform', (d) => `rotate(${computeRotation(d)})`)

  $('.goal').hover(
    function(e) {
      $(this).children('text').tooltip('toggle');
      $(this).children('path').css('fill-opacity', 1);
    }, function(e) {
      $(this).children('text').tooltip('dispose');
      $(this).children('path').css('fill-opacity', 0.9);
    },
  );
}

function updateSDGWheel() {
  // Variables
  let height = getSize();
  let width = getSize();
  
  d3.selectAll('svg')
    .attr('height', height)
    .attr('width', width);
  const radius = getSize() / 2.5;

  // Create primary <g> element
  const g = d3.selectAll('svg')
    .select('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  // Data strucure
  const partition = createPartition(radius);

  // Find data root
  const root = createRoot();
  partition(root);

  distanceFromGoal = {};

  // Path
  g.selectAll('g')
    .data(root.descendants())
    .select('path')
    .attr('d', (d) => {
      if (!d.data.name.includes('.')) {
        return getGoalArc()(d);
      }
      const goal = parseInt(d.data.name.substr(0, d.data.name.indexOf('.')), 10);
      return getTargetArc(goal, width, height)(d);
    });

  // Text
  g.selectAll('.goal, .selectedTarget')
    .select('text')
    .attr('transform', (d) => {
      const goal = d.data.name.substr(0, d.data.name.indexOf('.')) || d.id;
      const arc = d.id.includes('.') ? 
        getTargetArc(goal, width, height) : getGoalArc(goal, width, height)
      return `translate(${arc.centroid(d)})rotate(${computeRotation(d)})`;
    })
    .attr('data-translate-x', (d) => {
      // For use in export
      const goal = d.data.name.substr(0, d.data.name.indexOf('.')) || d.id;
      if (d.id.includes('.')) return getTargetArc(goal, width, height).centroid(d)[0];
    })
    .attr('data-translate-y', (d) => {
      // For use in export
      const goal = d.data.name.substr(0, d.data.name.indexOf('.')) || d.id;
      if (d.id.includes('.')) return getTargetArc(goal, width, height).centroid(d)[1];
    })
    .attr('data-rotate', (d) => computeRotation(d))
    .attr('font-size', 8 * (Math.min(width, height) / 500));

  // Image
  g.selectAll('.goal')
    .select('svg')
    .attr('x', (d) => getGoalArc().centroid(d)[0])
    .attr('y', (d) => getGoalArc().centroid(d)[1])
    .selectAll('image')
    .attr('width', 15 * (Math.min(width, height) / 500))
    .attr('height', 15 * (Math.min(width, height) / 500))
    .attr('x', (d) => -(15 * (Math.min(width, height) / 500)) / 2)
    .attr('y', (d) => -(15 * (Math.min(width, height) / 500)) / 2)
    .attr('transform', (d) => `rotate(${computeRotation(d)})`)
    .attr('data-rotate', (d) => computeRotation(d));
}

function onWindowResize() {
  window.addEventListener('resize', function(event) {
    updateSDGWheel();
  }, true);
}

document.addEventListener('DOMContentLoaded', () => {
  onWindowResize();
  createSDGWheel();
  updateSDGWheel();
});

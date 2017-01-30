export function getIcon(alt: string): string {
    switch(alt) {
      case "DealerSocket":
        return "trending_up";
      case "DealerFire":
        return "dashboard";
      case "Inventory+":
        return "search";
      case "iDMS":
        return "directions_car";
      case "Revenue Radar":
        return "attach_money";
      default:
        break;
    }
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function describeArc(x, y, radius, startAngle, endAngle){

    var start = this.polarToCartesian(x, y, radius, endAngle);
    var end = this.polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

export function getDayDiff(start_ms: number, end_ms: number, days_diff: number) {
  var days_diff_ms = Math.abs(days_diff) * 86400000;
  return (days_diff >= 0) ? start_ms + days_diff_ms : end_ms - days_diff;
}

export function calculateMilestoneCompletion(p_info: any, m_info: any): any {
  if(typeof p_info !== "object" || typeof m_info !== "object") {
    return null;
  }
  // gets milliseconds then divides by 86400000 to convert milliseconds into days.
  var date_now = Date.parse(p_info.started) + (14 * 86400000);
  var activation = Date.parse(p_info.activation);
  var started = Date.parse(p_info.started);
  var total_time = (activation - started) / 86400000 | 0;
  var elapsed_time = (date_now - started) / 86400000 | 0;

  var need_attenion_milestones: Array<string> = [];

  var total_points = 0;
  var acc_points = 0;
  for(let milestone of m_info.milestones) {
    if(this.getDayDiff(started, activation, milestone.days_differential) <= date_now && milestone.status === "Complete") {
      acc_points += milestone.points;
    }
    if(milestone.status === "Needs Attention") {
      need_attenion_milestones.push(milestone.name);
    }
    total_points += milestone.points;
  }
  var percent_complete = acc_points / total_points;

  return {
    percent_complete: percent_complete * 100,
    status: need_attenion_milestones.length > 0 ? "Needs Attention" : "On Schedule",
    need_attenion_milestones: need_attenion_milestones
  };
}

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

export function fuzzysearch (needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
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

/**
 * Fancy ID generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
 *    latter ones will sort after the former ones.  We do this by using the previous random bits
 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
 */
// export function generatePushID() {
//   // Modeled after base64 web-safe chars, but ordered by ASCII.
//   var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//
//   // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
//   var lastPushTime = 0;
//
//   // We generate 72-bits of randomness which get turned into 12 characters and appended to the
//   // timestamp to prevent collisions with other clients.  We store the last characters we
//   // generated because in the event of a collision, we'll use those same characters except
//   // "incremented" by one.
//   var lastRandChars = [];
//
//   return function() {
//     var now = new Date().getTime();
//     var duplicateTime = (now === lastPushTime);
//     lastPushTime = now;
//
//     var timeStampChars = new Array(8);
//     for (var i = 7; i >= 0; i--) {
//       timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
//       // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
//       now = Math.floor(now / 64);
//     }
//     if (now !== 0) throw new Error('We should have converted the entire timestamp.');
//
//     var id = timeStampChars.join('');
//
//     if (!duplicateTime) {
//       for (i = 0; i < 12; i++) {
//         lastRandChars[i] = Math.floor(Math.random() * 64);
//       }
//     } else {
//       // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
//       for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
//         lastRandChars[i] = 0;
//       }
//       lastRandChars[i]++;
//     }
//     for (i = 0; i < 12; i++) {
//       id += PUSH_CHARS.charAt(lastRandChars[i]);
//     }
//     if(id.length != 20) throw new Error('Length should be 20.');
//
//     return id;
//   };
// }

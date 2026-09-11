import "./StatusDot.css";

/**
 * StatusDot — the only place a status colour is rendered.
 *
 * @param {"ok"|"warn"|"fault"} status  semantic state
 * @param {boolean} small               compact dot without the glow ring
 * @param {"span"|"i"} as               element tag (use "i" inside text rows)
 */
export default function StatusDot({ status = "ok", small = false, as: Tag = "span", ...rest }) {
  return <Tag className={`status-dot ${status}${small ? " sm" : ""}`} {...rest} />;
}

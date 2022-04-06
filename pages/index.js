import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Layout from '../components/layout';

function Index() {
  return (
    <Layout>
      <h1>Welcome to Music CPR</h1>
      <p>MusicCPR is a free web-based platform to promote standards-based instrumental music education. MusicCPR aligns with four artistic processes found in National Standards for Music Education: create, perform, respond, and connect and their manifestations in state standards for instrumental music education (e.g., New York&apos;s Arts Learning Standards, Virginia&apos;s Music Standards of Learning).</p>

      <CardGroup>
        <Card>
          <Card.Img variant="top" as="div">
            <div className='artistic-process'>C</div>
          </Card.Img>
          <Card.Body>
            <Card.Title>Create</Card.Title>
            <Card.Text>
        This is a wider card with supporting text below as a natural lead-in to
        additional content. This content is a little bit longer.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" as="div">
            <div className='artistic-process'>P</div>
          </Card.Img>
          <Card.Body>
            <Card.Title>Perform</Card.Title>
            <Card.Text>
        This card has supporting text below as a natural lead-in to additional
        content.{' '}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" as="div">
            <div className='artistic-process'>R</div>
          </Card.Img>
          <Card.Body>
            <Card.Title>Respond</Card.Title>
            <Card.Text>
        This is a wider card with supporting text below as a natural lead-in to
        additional content. This card has even longer content than the first to
        show that equal height action.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
      </CardGroup>

      <p>We provide teachers with research-based and standards-aligned tools for facilitating and assessing individual students&apos; music learning. These tools connect with established repertoire on state music education association lists, as well as newly commissioned repertoire that highlights underrepresented musics and composers.</p>

      <p>MusicCPR is housed at James Madison University, in a collaboration between the Department of Computer Science and the Center for Inclusive Music Engagement. Development has been supported by grants from University of Rochester&apos;s Eastman School of Music and James Madison University&apos;s College of Visual and Performing Arts.</p>

      <p>If you&apos;re interested in trying MusicCPR, or have a question for the team, don&apos;t hesitate to drop us a line at feedback@tele.band.</p>
    </Layout>
  );
}

export default Index;
